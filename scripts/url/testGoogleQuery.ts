import { buildGoogleQuery } from "./buildGoogleQuery"

const tests = [
    { name: "Hazelden Betty Ford", city: "Rancho Mirage", state: "CA" },
    { name: "Sierra Tucson", city: "Tucson", state: "AZ" },
    { name: "Caron Treatment Center", city: "Wernersville", state: "PA" },
]

for (const t of tests) {
    console.log(buildGoogleQuery(t.name, t.city, t.state))
}