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

export interface TrainStationListResponse {
    total_count: number;
    results: {
        libelle: string;
        commune: string;
        c_geo: {
            lon: number; // Longitude
            lat: number; // Latitude
        }
    }[]
}

const fetchGeoAPI = async (cityName: string): Promise<City> => {
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

const fetchTrainStationListFromSNCF = async (cityName: string): Promise<City> => {
    const citySplited = cityName.split(' ')[0] // Use only the first word of the city name (ex: "Paris (Intramuros)" => "Paris")
    const BASE_SNCF_API_TRAIN_STATION_LIST = 'https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/liste-des-gares/records';
    const where = `libelle like "${citySplited}"`
    console.log('fetchTrainStationListFromSNCF where : ', where)
    const limit = 1
    const { data, status }: {data: TrainStationListResponse} = await axios.get(BASE_SNCF_API_TRAIN_STATION_LIST, {
        params: {
            where,
            limit
        },
    })


    if (!data || data?.totalCount === 0) {
        throw new Error('No train station found for :', cityName)
    }

    const trainStation = data.results[0]
    console.log('c_geo : ', trainStation.c_geo)
    const latitude = trainStation.c_geo.lat ?? 0
    const longitude = trainStation.c_geo.lon ?? 0

    return {
        name: cityName,
        latitude,
        longitude
    }
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
    const cityFromAPI = await fetchTrainStationListFromSNCF(cityName)
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
