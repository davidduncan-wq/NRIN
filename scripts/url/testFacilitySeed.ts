import { prepareFacilitySeed } from "./prepareFacilitySeedList"

const facilities = [
    {
        name: "Hazelden Betty Ford",
        city: "Rancho Mirage",
        state: "CA",
        website: "https://www.hazeldenbettyford.org/locations/betty-ford-center-rancho-mirage"
    },
    {
        name: "Sierra Tucson",
        city: "Tucson",
        state: "AZ",
        website: "www.sierratucson.com/admissions"
    }
]

for (const f of facilities) {
    console.log(prepareFacilitySeed(f))
}