// server/utils/import-trains.ts
import { PrismaClient } from '~/prisma/generated/client'
import axios from 'axios'
import { parse } from '@fast-csv/parse'
import type { AdaptedTrainData } from '~/types/common'

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

export async function importTrains(): Promise<string> {
  try {
    const SNCF_CSV_URL = 'https://data.sncf.com/api/explore/v2.1/catalog/datasets/tgvmax/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B&refine=od_happy_card%3AOUI'

    console.log('Downloading CSV file...')
    const response = await axios.get(SNCF_CSV_URL, { responseType: 'stream' })
    console.log('Downloaded CSV file.')

    const trains: AdaptedTrainData[] = []

    await new Promise<void>((resolve, reject) => {
      response.data
        .pipe(parse({ headers: newHeaders, delimiter: ';', renameHeaders: true }))
        .on('data', (row: CSVRow) => {
          const trainData = rowToTrainAdapter(row)
          if (trainData) trains.push(trainData)
        })
        .on('end', resolve)
        .on('error', reject)
    })

    console.log(`Parsed ${trains.length} trains from CSV.`)

    await prisma.train.deleteMany()
    console.log('Database cleared.')

    const batchSize = 1000
    for (let i = 0; i < trains.length; i += batchSize) {
      const batch = trains.slice(i, i + batchSize)
      await prisma.train.createMany({ data: batch })
      console.log(`Inserted ${i + batch.length} trains.`)
    }

    return `${trains.length} trains imported with success.`
  }
  catch (error) {
    console.error('Error in importTrains:', error)
    throw error
  }
  finally {
    await prisma.$disconnect()
  }
}

function rowToTrainAdapter(row: CSVRow): AdaptedTrainData | null {
  try {
    const date = new Date(row.date)
    const departureDateTime = new Date(`${row.date}T${row.departureHour}`)
    const arrivalDateTime = new Date(`${row.date}T${row.arrivalHour}`)

    if (arrivalDateTime <= departureDateTime) {
      arrivalDateTime.setDate(arrivalDateTime.getDate() + 1)
    }

    return {
      date,
      trainNo: row.trainNo,
      entity: row.entity || null,
      axe: row.axe || null,
      originIata: row.originIata,
      destinationIata: row.destinationIata,
      origin: row.origin,
      destination: row.destination,
      departureDateTime,
      arrivalDateTime,
      isEligibleForMaxSubscription: row.od_happy_card === 'OUI',
    }
  }
  catch (error) {
    console.error('Error transforming row:', error)
    return null
  }
}
