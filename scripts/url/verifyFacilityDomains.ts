import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ====== CHANGE THESE 4 TO MATCH YOUR TABLE ======
const SOURCE_TABLE = "facility_sites";
const ID_COL = "id";
const NAME_COL = "name";
const DOMAIN_COL = "website";
// ===============================================

const PAGE_SIZE = 500;
const CONCURRENCY = 10;
const TIMEOUT_MS = 12000;
const MAX_REDIRECTS = 5;

type SourceRow = {
    [key: string]: unknown;
};

type CheckResult = {
    id: string | number | null;
    name: string;
    input_domain: string;
    normalized_start_url: string;
    final_url: string;
    final_domain: string;
    status:
    | "valid"
    | "redirected"
    | "broken"
    | "timeout"
    | "missing"
    | "invalid_domain";
    http_status: number | null;
    error: string;
    redirect_hops: number;
};

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function toCsvValue(value: unknown): string {
    const s = String(value ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}

function looksLikeDomain(input: string): boolean {
    const s = input.trim().toLowerCase();
    if (!s) return false;
    if (s.includes(" ")) return false;
    if (!s.includes(".")) return false;
    if (/^https?:\/\/$/i.test(s)) return false;
    return true;
}

function stripProtocol(input: string): string {
    return input.replace(/^https?:\/\//i, "").replace(/\/+$/, "").trim();
}

function getHostname(urlString: string): string {
    try {
        return new URL(urlString).hostname.toLowerCase();
    } catch {
        return "";
    }
}

function candidateStartUrls(domain: string): string[] {
    const bare = stripProtocol(domain);
    return [`https://${bare}`, `http://${bare}`];
}

function toOriginUrl(input: string): string {
    const trimmed = String(input ?? "").trim();
    if (!trimmed) return "";

    try {
        const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
        const u = new URL(withProtocol);
        return `${u.protocol}//${u.hostname}`;
    } catch {
        const bare = stripProtocol(trimmed).split("/")[0];
        return bare ? `https://${bare}` : "";
    }
}

async function fetchOnce(
    url: string,
    method: "HEAD" | "GET"
): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        return await fetch(url, {
            method,
            redirect: "manual",
            signal: controller.signal,
            headers:
                method === "GET"
                    ? {
                        "user-agent": "Mozilla/5.0 NRIN Domain Verifier",
                        accept: "text/html,application/xhtml+xml",
                        range: "bytes=0-1024",
                    }
                    : {
                        "user-agent": "Mozilla/5.0 NRIN Domain Verifier",
                    },
        });
    } finally {
        clearTimeout(timeout);
    }
}

async function fetchWithFallback(url: string): Promise<Response> {
    try {
        const headRes = await fetchOnce(url, "HEAD");

        if (headRes.status === 405 || headRes.status === 403) {
            return await fetchOnce(url, "GET");
        }

        return headRes;
    } catch {
        return await fetchOnce(url, "GET");
    }
}

async function resolveUrl(startUrl: string): Promise<{
    finalUrl: string;
    httpStatus: number | null;
    redirectHops: number;
    error: string;
    status: CheckResult["status"];
}> {
    let currentUrl = startUrl;
    let hops = 0;

    for (; ;) {
        let res: Response;

        try {
            res = await fetchWithFallback(currentUrl);
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            if (/abort|timeout/i.test(msg)) {
                return {
                    finalUrl: currentUrl,
                    httpStatus: null,
                    redirectHops: hops,
                    error: msg,
                    status: "timeout",
                };
            }

            return {
                finalUrl: currentUrl,
                httpStatus: null,
                redirectHops: hops,
                error: msg,
                status: "broken",
            };
        }

        const status = res.status;

        if ((status >= 200 && status < 300) || status === 403 || status === 501) {
            return {
                finalUrl: currentUrl,
                httpStatus: status,
                redirectHops: hops,
                error: status === 403 ? "http 403 accepted" : "",
                status: hops > 0 ? "redirected" : "valid",
            };
        }

        if (status >= 300 && status < 400) {
            const location = res.headers.get("location");

            if (!location) {
                return {
                    finalUrl: currentUrl,
                    httpStatus: status,
                    redirectHops: hops,
                    error: "redirect with no location header",
                    status: "broken",
                };
            }

            const nextUrl = new URL(location, currentUrl).toString();
            hops += 1;

            if (hops > MAX_REDIRECTS) {
                return {
                    finalUrl: nextUrl,
                    httpStatus: status,
                    redirectHops: hops,
                    error: "too many redirects",
                    status: "broken",
                };
            }

            currentUrl = nextUrl;
            continue;
        }

        return {
            finalUrl: currentUrl,
            httpStatus: status,
            redirectHops: hops,
            error: `http ${status}`,
            status: "broken",
        };
    }
}

async function checkDomain(
    id: string | number | null,
    name: string,
    rawDomain: string
): Promise<CheckResult> {
    const trimmed = String(rawDomain ?? "").trim();

    if (!trimmed) {
        return {
            id,
            name,
            input_domain: "",
            normalized_start_url: "",
            final_url: "",
            final_domain: "",
            status: "missing",
            http_status: null,
            error: "blank domain",
            redirect_hops: 0,
        };
    }

    if (!looksLikeDomain(trimmed)) {
        return {
            id,
            name,
            input_domain: trimmed,
            normalized_start_url: "",
            final_url: "",
            final_domain: "",
            status: "invalid_domain",
            http_status: null,
            error: "not a usable domain",
            redirect_hops: 0,
        };
    }

    const starts = candidateStartUrls(trimmed);
    let best: Awaited<ReturnType<typeof resolveUrl>> | null = null;
    let chosenStart = starts[0];

    for (const start of starts) {
        const result = await resolveUrl(start);

        if (result.status === "valid" || result.status === "redirected") {
            return {
                id,
                name,
                input_domain: trimmed,
                normalized_start_url: start,
                final_url: result.finalUrl,
                final_domain: getHostname(result.finalUrl),
                status: result.status,
                http_status: result.httpStatus,
                error: result.error,
                redirect_hops: result.redirectHops,
            };
        }

        if (!best) {
            best = result;
            chosenStart = start;
        }

        await sleep(150);
    }

    // second-pass salvage: if input looked like a full URL/path, retry the site root
    const originUrl = toOriginUrl(trimmed);
    if (originUrl) {
        const originHost = getHostname(originUrl);
        const inputHost = getHostname(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);

        if (originHost && originHost === inputHost) {
            const originResult = await resolveUrl(originUrl);

            if (originResult.status === "valid" || originResult.status === "redirected") {
                return {
                    id,
                    name,
                    input_domain: trimmed,
                    normalized_start_url: originUrl,
                    final_url: originResult.finalUrl,
                    final_domain: getHostname(originResult.finalUrl),
                    status: originResult.status,
                    http_status: originResult.httpStatus,
                    error: originResult.error,
                    redirect_hops: originResult.redirectHops,
                };
            }
        }
    }

    return {
        id,
        name,
        input_domain: trimmed,
        normalized_start_url: chosenStart,
        final_url: best?.finalUrl ?? "",
        final_domain: getHostname(best?.finalUrl ?? ""),
        status: best?.status ?? "broken",
        http_status: best?.httpStatus ?? null,
        error: best?.error ?? "unknown error",
        redirect_hops: best?.redirectHops ?? 0,
    };
}

async function fetchAllRows(): Promise<SourceRow[]> {
    const rows: SourceRow[] = [];
    let from = 0;

    for (; ;) {
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabase
            .from(SOURCE_TABLE)
            .select(`${ID_COL}, ${NAME_COL}, ${DOMAIN_COL}`)
            .range(from, to);

        if (error) throw error;
        if (!data || data.length === 0) break;

        rows.push(...data);
        from += PAGE_SIZE;
    }

    return rows;
}

async function runPool<T, R>(
    items: T[],
    worker: (item: T, index: number) => Promise<R>,
    concurrency: number
): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let nextIndex = 0;

    async function runner() {
        for (; ;) {
            const current = nextIndex++;
            if (current >= items.length) return;
            results[current] = await worker(items[current], current);
        }
    }

    await Promise.all(
        Array.from({ length: Math.min(concurrency, items.length) }, () => runner())
    );

    return results;
}

async function main() {
    const rows = await fetchAllRows();

    console.log(`rows fetched: ${rows.length}`);

    const filtered = rows.filter((row) => {
        const value = row[DOMAIN_COL];
        return value !== null && value !== undefined && String(value).trim() !== "";
    });

    console.log(`rows with domains to verify: ${filtered.length}`);

    let completed = 0;

    const results = await runPool(
        filtered,
        async (row) => {
            const result = await checkDomain(
                (row[ID_COL] as string | number | null) ?? null,
                String(row[NAME_COL] ?? ""),
                String(row[DOMAIN_COL] ?? "")
            );

            completed += 1;
            if (completed % 25 === 0 || completed === filtered.length) {
                console.log(`verified ${completed}/${filtered.length}`);
            }

            return result;
        },
        CONCURRENCY
    );

    const broken = results.filter((r) =>
        ["broken", "timeout", "invalid_domain", "missing"].includes(r.status)
    );

    const redirected = results.filter((r) => r.status === "redirected");
    const valid = results.filter((r) => r.status === "valid");

    console.log("");
    console.log(`valid: ${valid.length}`);
    console.log(`redirected: ${redirected.length}`);
    console.log(`broken/timeout/invalid/missing: ${broken.length}`);

    await mkdir(path.resolve("tmp"), { recursive: true });

    const jsonPath = path.resolve("tmp/domain_verification_results.json");
    await writeFile(jsonPath, JSON.stringify(results, null, 2), "utf8");

    const csvHeader = [
        "id",
        "name",
        "input_domain",
        "normalized_start_url",
        "final_url",
        "final_domain",
        "status",
        "http_status",
        "error",
        "redirect_hops",
    ];

    const csvLines = [
        csvHeader.join(","),
        ...results.map((r) =>
            [
                r.id,
                r.name,
                r.input_domain,
                r.normalized_start_url,
                r.final_url,
                r.final_domain,
                r.status,
                r.http_status,
                r.error,
                r.redirect_hops,
            ]
                .map(toCsvValue)
                .join(",")
        ),
    ];

    const csvPath = path.resolve("tmp/domain_verification_results.csv");
    await writeFile(csvPath, csvLines.join("\n"), "utf8");

    const brokenCsvLines = [
        csvHeader.join(","),
        ...broken.map((r) =>
            [
                r.id,
                r.name,
                r.input_domain,
                r.normalized_start_url,
                r.final_url,
                r.final_domain,
                r.status,
                r.http_status,
                r.error,
                r.redirect_hops,
            ]
                .map(toCsvValue)
                .join(",")
        ),
    ];

    const brokenCsvPath = path.resolve("tmp/domain_verification_broken_only.csv");
    await writeFile(brokenCsvPath, brokenCsvLines.join("\n"), "utf8");

    console.log("");
    console.log(`wrote: ${jsonPath}`);
    console.log(`wrote: ${csvPath}`);
    console.log(`wrote: ${brokenCsvPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});