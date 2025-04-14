import type { TrainStation } from '~/server/domains/train-stations/entities/train-station'

export interface TrainStationsRepository {
  deleteAllEntries(): Promise<void>
  insertTrainStation(trainStation: TrainStation): Promise<void>
  insertManyTrainStations(trainStations: TrainStation[]): Promise<void>
  getTrainStations(filters: GetTrainStationsFilters): Promise<TrainStation[]>
}

export interface GetTrainStationsFilters {
  name?: string
  limit?: number
}
