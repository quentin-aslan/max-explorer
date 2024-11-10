import axios from 'axios'
import prisma from '~/lib/prisma'
import type { GetDestinationCoordinatesResponse } from '~/types/common'

interface Props {
  destinationName: string
}

export interface TrainStationListResponse {
  total_count: number
  results: {
    libelle: string
    commune: string
    c_geo: {
      lon: number // Longitude
      lat: number // Latitude
    }
  }[]
}

const fetchTrainStationListFromSNCF = async (destinationName: string): Promise<GetDestinationCoordinatesResponse> => {
  const citySplit = destinationName.split(' ')[0] // Use only the first word of the destination name (ex: "Paris (Intramuros)" => "Paris")

  const BASE_SNCF_API_TRAIN_STATION_LIST = 'https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/liste-des-gares/records'
  const where = `libelle like "${citySplit}"`
  const limit = 1

  const { data }: { data: TrainStationListResponse } = await axios.get(BASE_SNCF_API_TRAIN_STATION_LIST, {
    params: {
      where,
      limit,
    },
  })

  if (!data || data?.total_count === 0) {
    throw new Error(`No train station found for : ${destinationName}`)
  }

  const trainStation = data.results[0]
  const latitude = trainStation.c_geo.lat ?? 0
  const longitude = trainStation.c_geo.lon ?? 0

  return {
    name: destinationName,
    latitude,
    longitude,
  }
}

const getDestinationLocation = async (destinationName: string): GetDestinationCoordinatesResponse => {
  // First check if the destination is in the database
  const destinationFromDb = await prisma.city.findFirst({
    where: {
      name: destinationName,
    },
  })

  if (destinationFromDb) {
    return destinationFromDb
  }

  // If not, fetch the coordinates from the API
  const destinationFromAPI = await fetchTrainStationListFromSNCF(destinationName)
  if (destinationFromAPI) {
    await prisma.city.create({ data: destinationFromAPI })
    return destinationFromAPI
  }

  return null
}

export default defineEventHandler(async (event) => {
  const { destinationName }: Props = getQuery(event)

  if (!destinationName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing destination name',
    })
  }

  try {
    return await getDestinationLocation(destinationName)
  }
  catch (e) {
    console.error(e)
    return e
  }
})
