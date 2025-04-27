import type { TrainStation } from '~/domains/train-stations/entities/train-station'

export interface TrainStationsRepository {
  fetchTrainStations(): Promise<TrainStation[]>
}
