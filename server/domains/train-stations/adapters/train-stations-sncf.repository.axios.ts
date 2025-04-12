import axios from 'axios'
import { parse } from '@fast-csv/parse'
import type { TrainStationsSncfRepository } from '~/server/domains/train-stations/ports/train-stations-sncf.repository'
import type { TrainStationSncf } from '~/server/domains/train-stations/entities/train-stations-sncf'
import { normalizeName } from '~/server/utils'
import type { TrainStationSncfTraffic } from '~/server/domains/train-stations/entities/train-station-sncf-traffic'

interface ListeDesGaresCSVRow {
  nom: string
  position_geographique: string
}

interface FrequentationGareCSVRow {
  name: string
  traffic: string
}

export class TrainStationsSncfRepositoryAxios implements TrainStationsSncfRepository {
  public async fetchTrainStations(): Promise<TrainStationSncf[]> {
    const URL_WITH_OPTIONS
        = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/gares-de-voyageurs/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B&select=nom%2C%20position_geographique`

    const response = await axios.get(URL_WITH_OPTIONS, { responseType: 'stream' })
    const trainStations: TrainStationSncf[] = []

    await new Promise<void>((resolve, reject) => {
      response.data
        .pipe(parse({ headers: [
          'nom',
          'position_geographique',
        ], delimiter: ';', renameHeaders: true }))
        .on('data', (row: ListeDesGaresCSVRow) => {
          const trainStation = this.rowToTrainStation(row)
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

  public async fetchTrainStationsTraffic(): Promise<TrainStationSncfTraffic[]> {
    const URL_WITH_OPTIONS
        = `https://data.sncf.com/api/explore/v2.1/catalog/datasets/frequentation-gares/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B&select=nom_gare%2C%20total_voyageurs_non_voyageurs_2023`

    const response = await axios.get(URL_WITH_OPTIONS, { responseType: 'stream' })

    const trainStationsTraffic: TrainStationSncfTraffic[] = []

    await new Promise<void>((resolve, reject) => {
      response.data
        .pipe(parse({ headers: [
          'name',
          'traffic',
        ], delimiter: ';', renameHeaders: true }))
        .on('data', (row: FrequentationGareCSVRow) => {
          if (row) {
            const normName = normalizeName(row.name)
            trainStationsTraffic.push({
              name: normName,
              traffic: parseInt(row.traffic) || 0,
            })
          }
        })
        .on('end', resolve)
        .on('error', reject)
    })

    console.log(`Parsed ${trainStationsTraffic.length} train stations traffic from CSV.`)
    return trainStationsTraffic
  }

  private rowToTrainStation(row: ListeDesGaresCSVRow): TrainStationSncf | null {
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
}
