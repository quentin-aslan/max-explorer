import axios from "axios";
import type {AddressAPIResponse, City} from "~/types";
import prisma from "~/lib/prisma";

interface Props {
    cityName: string
}

export interface AddressAPIResponse {
    features: {
        geometry: {
            coordinates: [number, number]
        },
        properties : {
            type: string
        }
    }[]
}

const fetchGeoAPI = async (cityName: string) => {
    const GEO_API_BASE = 'https://api-adresse.data.gouv.fr/search/';
    const { data, status }: { data: AddressAPIResponse } = await axios.get(GEO_API_BASE, {
        params: {
            q: cityName
        },
    })

    if(data.features.length === 0) {
        throw new Error('No city found for :', cityName)
    }

    const feature =
        data.features.find((feature) => feature.properties?.type === 'municipality') ?? data.features[0]

    const latitude = feature?.geometry?.coordinates[1]
    const longitude = feature?.geometry?.coordinates[0]

    if (!latitude || !longitude) {
        throw new Error('No coordinates found for :', cityName)
    }

    const city: City = {
        name: cityName,
        latitude,
        longitude
    }

    return city
}
const getCityLocation = async (cityName: string): City => {
    // First check if the city is in the database
    const cityFromDb = await prisma.city.findFirst({
        where: {
            name: cityName
        }
    })

    if (cityFromDb) {
        console.log('cityFromDb found')
        return cityFromDb
    }

    // If not, fetch the coordinates from the API
    const cityFromAPI = await fetchGeoAPI(cityName)
    if(cityFromAPI) {
        console.log('cityFromAPI found')
        await prisma.city.create({ data: cityFromAPI})
        return cityFromAPI
    }


    return null
}


export default defineEventHandler(async (event) => {
    const { cityName }: Props = getQuery(event);

    if (!cityName) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing city name',
        })
    }

    try {
        return await getCityLocation(cityName)
    } catch (e) {
        console.error(e)
        return e
    }
});
