import type { TrainViewModel } from '~/domains/trips/entities/view-models/train.view-model'

export interface JourneyViewModel {
  connectionDurationMinutes: number
  journeyTotalDurationMinutes: number
  trains: TrainViewModel[]
}
