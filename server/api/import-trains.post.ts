// server/api/import-trains.post.ts
import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import { defineEventHandler, createError } from 'h3'
import { parse } from '@fast-csv/parse'
import type { AdaptedTrainData } from '~/server/train-type'

const prisma = new PrismaClient()

interface CSVRow {
  date: string
  trainNo: string
  entity: string
  axe: string
  originIata: string
  destinationIata: string
  origin: string
  destination: string
  departureHour: string
  arrivalHour: string
  od_happy_card: string
}

const newHeaders = [
  'date',
  'trainNo',
  'entity',
  'axe',
  'originIata',
  'destinationIata',
  'origin',
  'destination',
  'departureHour',
  'arrivalHour',
  'od_happy_card',
]

export default defineEventHandler(async (event) => {
  try {
    // Téléchargement du fichier CSV
    const SNCF_CSV_URL
            = 'https://data.sncf.com/api/explore/v2.1/catalog/datasets/tgvmax/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B&refine=od_happy_card%3AOUI'

    console.log('Downloading CSV file...')
    const response = await downloadCSV(SNCF_CSV_URL)
    console.log('Downloaded CSV file.')

    const trains: AdaptedTrainData[] = []

    await new Promise<void>((resolve, reject) => {
      response.data
        .pipe(parse({ headers: newHeaders, delimiter: ';', renameHeaders: true }))
        .on('data', (row: CSVRow) => {
          const trainData = rowToTrainAdapter(row)
          if (trainData) {
            // console.log(`Parsed train ${trainData.trainNo} origine ${trainData.origin} destination ${trainData.destination}`)
            trains.push(trainData)
          }
        }).on('end', () => {
          resolve()
        }).on('error', (error: Error) => {
          reject(error)
        })
    })

    console.log(`Parsed ${trains.length} trains from CSV.`)

    // Insérer les données dans la base de données
    await insertTrainsInDataBase(trains)

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

const downloadCSV = async (url: string): Promise<AxiosResponse<any>> => {
  return await axios.get(url, { responseType: 'stream' })
}

const insertTrainsInDataBase = async (trains: AdaptedTrainData[]) => {
  // First, clear the database
  await prisma.train.deleteMany()
  console.log('Database cleared.')

  const batchSize = 1000
  for (let i = 0; i < trains.length; i += batchSize) {
    const batch = trains.slice(i, i + batchSize)
    await prisma.train.createMany({
      data: batch,
    })
    console.log(`Inserted ${i + batch.length} trains.`)
  }
}

const rowToTrainAdapter = (row: CSVRow): AdaptedTrainData => {
  try {
    const date = new Date(row.date)
    const departureDateTime = new Date(`${row.date}T${row.departureHour}`)
    const arrivalDateTime = new Date(`${row.date}T${row.arrivalHour}`)

    // Ajuster pour les arrivées après minuit
    if (arrivalDateTime <= departureDateTime) {
      arrivalDateTime.setDate(arrivalDateTime.getDate() + 1)
    }

    const isEligibleForMaxSubscription = row.od_happy_card === 'OUI'

    return {
      date,
      trainNo: row.trainNo,
      entity: row.entity || null,
      axe: row.axe || null,
      originIata: row.originIata,
      destinationIata: row.destinationIata,
      origin: row.origin,
      destination: row.destination,
      departureDateTime: departureDateTime,
      arrivalDateTime: arrivalDateTime,
      isEligibleForMaxSubscription,
    }
  }
  catch (error) {
    console.error('Error transforming row:', error)
    return null
  }
}
