import type { TrainViewModel } from '~/domains/trips/entities/train.view-model'

// TODO: A implementer dans les presenter (on va pouvoir mettre des tests unitaires sur les calcules de temps avec ça)
export interface JourneyViewModel {
  connectionDurationMinutes: number
  journeyTotalDurationMinutes: number
  trains: TrainViewModel[]
}
