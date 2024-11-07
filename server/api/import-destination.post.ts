// server/api/import-trains.post.ts
import { PrismaClient } from '@prisma/client'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { createError, defineEventHandler } from 'h3'
import { parse } from '@fast-csv/parse'
import type { TrainStation } from '~/types/common'
import { normalizeName } from '~/server/utils'

/**
 * Import the destinations coordinates and population from the SNCF API into the database
 * Some Destination are not available through the API, so we need to import them manually (Ex: Luxembourg, Bruxelles, ...)
 */

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
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

      trainStations.push({ ...trainStationFromAPI, traffic })
    }

    // We insert the train stations in the database
    await insertTrainStationsInDataBase(trainStations)

    return { message: 'Data imported with success' }
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
})

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
  commune: string
  latitude: number
  longitude: number
}

interface ListeDesGaresCSVRow {
  libelle: string
  commune: string
  c_geo: string
}

const newHeadersListeDesGares = [
  'libelle',
  'commune',
  'c_geo',
]

const getTrainStationsFromSNCF = async (): Promise<TrainStationFromAPI[]> => {
  try {
    const response = await downloadListeDesGaresCSV()

    const trainStations: TrainStation[] = []

    await new Promise<void>((resolve, reject) => {
      response.data
        .pipe(parse({ headers: newHeadersListeDesGares, delimiter: ';', renameHeaders: true }))
        .on('data', (row: ListeDesGaresCSVRow) => {
          const trainStation = rowToTrainStationAdapter(row)
          if (trainStation) {
            trainStations.push(trainStation)
          }
        }).on('end', () => {
          resolve()
        }).on('error', (error: Error) => {
          reject(error)
        })
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
     = `https://data.sncf.com/api/explore/v2.1/catalog/datasets/liste-des-gares/exports/csv?lang=fr&timezone=Europe/Paris&limiter=%3B&use_labels=true&select=libelle%2C%20commune%2C%20c_geo`
  return await axios.get(URL_WITH_OPTIONS, { responseType: 'stream' })
}

const rowToTrainStationAdapter = (row: ListeDesGaresCSVRow): TrainStationFromAPI => {
  try {
    const latitude = row.c_geo.split(',')[0]?.trim() ?? 0
    const longitude = row.c_geo.split(',')[1]?.trim() ?? 0

    return {
      name: normalizeName(row.libelle),
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
  libelle: string
  commune: string
  c_geo: string
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
        }).on('end', () => {
          resolve()
        }).on('error', (error: Error) => {
          reject(error)
        })
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
