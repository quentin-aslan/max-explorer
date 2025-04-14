import axios from 'axios'
import { parse } from '@fast-csv/parse'
import type { Train } from '../entities/train'
import type { TrainsSncfRepository } from '~/server/domains/trains/ports/trains-sncf.repository'
import { parseISODate } from '~/server/utils/dateUtils'

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

export class TrainsSncfRepositoryAxios implements TrainsSncfRepository {
  public async getTrains(): Promise<Train[]> {
    const SNCF_CSV_URL = 'https://data.sncf.com/api/explore/v2.1/catalog/datasets/tgvmax/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B&refine=od_happy_card%3AOUI'

    console.log('Downloading CSV file...')
    const response = await axios.get(SNCF_CSV_URL, { responseType: 'stream' })
    console.log('Downloaded CSV file.')

    const trains: Train[] = []

    await new Promise<void>((resolve, reject) => {
      response.data
        .pipe(parse({ headers: [
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
        ], delimiter: ';', renameHeaders: true }))
        .on('data', (row: CSVRow) => {
          const trainData = this.csvRowToTrain(row)
          if (trainData) trains.push(trainData)
        })
        .on('end', resolve)
        .on('error', reject)
    })

    console.log(`Parsed ${trains.length} trains from CSV.`)
    return trains
  }

  private csvRowToTrain(row: CSVRow): Train | null {
    try {
      const date = parseISODate(row.date)

      const [departureHour, departureMinute] = row.departureHour.split(':').map(Number)
      const departureDateTime = date.set({ hour: departureHour, minute: departureMinute })

      const [arrivalHour, arrivalMinute] = row.arrivalHour.split(':').map(Number)
      let arrivalDateTime = date.set({ hour: arrivalHour, minute: arrivalMinute })

      if (arrivalDateTime <= departureDateTime) {
        arrivalDateTime = arrivalDateTime.plus({ days: 1 })
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
}
