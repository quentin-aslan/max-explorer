import type { TrainStationSncf } from '~/server/domains/train-stations/entities/train-stations-sncf'
import type { TrainStationSncfTraffic } from '~/server/domains/train-stations/entities/train-station-sncf-traffic'

export interface TrainStationsSncfRepository {
  fetchTrainStations(): Promise<TrainStationSncf[]>
  fetchTrainStationsTraffic(): Promise<TrainStationSncfTraffic[]>
}
