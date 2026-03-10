import { extractDomainForSearch } from "./extractDomainForSearch"

const urls = [
    "hazeldenbettyford.org/locations/betty-ford-center-rancho-mirage",
    "https://www.newporthealthcare.com/programs/intensive-outpatient",
    "http://caron.org/treatment-programs/detox-services",
    "www.sierratucson.com/admissions/insurance-payment",
]

for (const url of urls) {
    console.log(url, "->", extractDomainForSearch(url))
}