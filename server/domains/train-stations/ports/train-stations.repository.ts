import type { TrainStation } from '~/server/domains/train-stations/entities/train-station'

export interface TrainStationsRepository {
  deleteAllEntries(): Promise<void> | void
  insertTrainStation(trainStation: TrainStation): Promise<void> | void
  insertManyTrainStations(trainStations: TrainStation[]): Promise<void> | void
  getTrainStations(filters: GetTrainStationsFilters): Promise<TrainStation[]> | TrainStation[]
}

export interface GetTrainStationsFilters {
  name?: string
  limit?: number
}
