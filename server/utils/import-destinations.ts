import { parse } from '@fast-csv/parse'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { createError } from 'h3'
import { PrismaClient } from '@prisma/client'
import type { TrainStation } from '~/types/common'
import { normalizeName } from '~/server/utils'

/**
 * Import the destinations coordinates and population from the SNCF API into the database
 * Some Destination are not available through the API, so we need to import them manually (Ex: Luxembourg, Bruxelles, ...)
 */

const prisma = new PrismaClient()

export async function importDestinations(): Promise<string> {
  try {
    // First we get the train stations from the SNCF API
    const trainStationsFromAPI = await getTrainStationsFromSNCF()

    // Second we get the train stations traffic from the SNCF API
    const trainStationsTraffic = await getTrainStationsTrafficFromSNCF()

    const trainStations: TrainStation[] = []

    // We merge the two lists
    for (const trainStationFromAPI of trainStationsFromAPI) {
      const traffic = trainStationsTraffic.find(t => t.name === trainStationFromAPI.name)
        ?.traffic ?? 0

      if (traffic === 0) {
        console.log(`No traffic found for ${trainStationFromAPI.name}`)
      }

      trainStations.push({ ...trainStationFromAPI, traffic })
    }

    // We insert the train stations in the database
    await insertTrainStationsInDataBase(trainStations)

    return `${trainStations.length} train stations imported with success`
  }
  catch (error) {
    console.error('An error occurred:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred during data import.',
    })
  }
  finally {
    await prisma.$disconnect()
  }
}

const insertTrainStationsInDataBase = async (trainStations: TrainStation[]) => {
  // First, clear the database
  await prisma.trainStation.deleteMany()

  // Then insert the train stations in the database
  const batchSize = 1000
  for (let i = 0; i < trainStations.length; i += batchSize) {
    const batch = trainStations.slice(i, i + batchSize)
    await prisma.trainStation.createMany({
      data: batch,
    })
    console.log(`Inserted ${i + batch.length} trainStations.`)
  }
}

// LISTES DES GARES CSV FUNCTIONS

interface TrainStationFromAPI {
  name: string
  latitude: number
  longitude: number
}

interface ListeDesGaresCSVRow {
  nom: string
  position_geographique: string
}

const newHeadersListeDesGares = [
  'nom',
  'position_geographique',
]

const getTrainStationsFromSNCF = async (): Promise<TrainStationFromAPI[]> => {
  try {
    const response = await downloadListeDesGaresCSV()

    const trainStations: TrainStationFromAPI[] = []

    await new Promise<void>((resolve, reject) => {
      response.data
        .pipe(parse({ headers: newHeadersListeDesGares, delimiter: ';', renameHeaders: true }))
        .on('data', (row: ListeDesGaresCSVRow) => {
          const trainStation = rowToTrainStationAdapter(row)
          if (trainStation) {
            trainStations.push(trainStation)
          }
        })
        .on('end', resolve)
        .on('error', reject)
    })

    console.log(`Parsed ${trainStations.length} train stations from CSV.`)
    return trainStations
  }
  catch (e) {
    console.error(e)
    return []
  }
}

const downloadListeDesGaresCSV = async (): Promise<AxiosResponse<any>> => {
  const URL_WITH_OPTIONS
        = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/gares-de-voyageurs/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B&select=nom%2C%20position_geographique`
  return await axios.get(URL_WITH_OPTIONS, { responseType: 'stream' })
}

const rowToTrainStationAdapter = (row: ListeDesGaresCSVRow): TrainStationFromAPI | null => {
  try {
    const latitude = row.position_geographique.split(',')[0]?.trim() ?? null
    const longitude = row.position_geographique.split(',')[1]?.trim() ?? null

    if (!latitude || !longitude) {
      console.error(`Lat or lng null for: ${row.nom}`)
      return null
    }

    return {
      name: normalizeName(row.nom),
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    }
  }
  catch (error) {
    console.error('Error transforming row:', error)
    return null
  }
}

// FREQUENTATION EN GARE CSV FUNCTIONS

interface TrainStationTraffic {
  name: string
  traffic: number
}

interface FrequentationGareCSVRow {
  name: string
  traffic: string
}

const newHeadersFrequentationGare = [
  'name',
  'traffic',
]

const getTrainStationsTrafficFromSNCF = async (): Promise<TrainStationTraffic[]> => {
  try {
    const response = await downloadFrequentationGareCSV()

    const trainStationsTraffic: TrainStationTraffic[] = []

    await new Promise<void>((resolve, reject) => {
      response.data
        .pipe(parse({ headers: newHeadersFrequentationGare, delimiter: ';', renameHeaders: true }))
        .on('data', (row: FrequentationGareCSVRow) => {
          if (row) {
            const normName = normalizeName(row.name)
            trainStationsTraffic.push({
              name: normName,
              traffic: parseInt(row.traffic) || 0,
            })

            // console.log(`Parsed train station ${normName} with traffic : ${row.traffic}`)
          }
        })
        .on('end', resolve)
        .on('error', reject)
    })

    console.log(`Parsed ${trainStationsTraffic.length} train stations traffic from CSV.`)
    return trainStationsTraffic
  }
  catch (e) {
    console.error(e)
    return []
  }
}

const downloadFrequentationGareCSV = async (): Promise<AxiosResponse<any>> => {
  const URL_WITH_OPTIONS
        = `https://data.sncf.com/api/explore/v2.1/catalog/datasets/frequentation-gares/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B&select=nom_gare%2C%20total_voyageurs_non_voyageurs_2023`
  return await axios.get(URL_WITH_OPTIONS, { responseType: 'stream' })
}
