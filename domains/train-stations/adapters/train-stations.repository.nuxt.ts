import type { TrainStationsRepository } from '~/domains/train-stations/ports/train-stations.repository'
import type { TrainStation } from '~/domains/train-stations/entities/train-station'

export interface TrainStationsFromApi {
  name: string
  traffic: number
  latitude: number
  longitude: number
}

export class TrainStationsRepositoryNuxt implements TrainStationsRepository {
  private readonly API_ENDPOINT = '/api/train-stations'

  public async fetchTrainStations(): Promise<TrainStation[]> {
    const { data, error } = await useFetch<TrainStationsFromApi[]>(this.API_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (error.value) {
      throw new Error('Failed to fetch train stations: ' + error.value.message)
    }

    if (!data.value) {
      return []
    }

    return data.value.map(trainStation => ({
      name: trainStation.name,
      traffic: trainStation.traffic,
      latitude: trainStation.latitude,
      longitude: trainStation.longitude,
    }))
  }
}
