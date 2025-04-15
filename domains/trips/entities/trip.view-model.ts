import type { TrainStation } from '~/domains/trips/entities/train-station'
import type { TrainViewModel } from '~/domains/trips/entities/train.view-model'

export interface TripViewModel {
  destinationName: string
  trainStation: TrainStation
  departureJourneys: TrainViewModel[][]
  returnJourneys: TrainViewModel[][]
}
