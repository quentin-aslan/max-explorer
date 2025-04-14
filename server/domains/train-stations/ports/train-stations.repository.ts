import type { TrainStation } from '~/server/domains/train-stations/entities/train-station'

export interface TrainStationsRepository {
  deleteAllEntries(): void
  insertTrainStation(trainStation: TrainStation): void
  insertManyTrainStations(trainStations: TrainStation[]): void
  getTrainStations(filters: GetTrainStationsFilters): TrainStation[]
}

export interface GetTrainStationsFilters {
  name?: string
  limit?: number
}
