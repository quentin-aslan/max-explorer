import type { TrainStation } from '~/domains/trips/entities/train-station'
import type { JourneyViewModel } from '~/domains/trips/entities/view-models/journey.view-model'

export interface TripViewModel {
  destinationName: string
  trainStation: TrainStation
  departureJourneys: JourneyViewModel[]
  returnJourneys: JourneyViewModel[]
}
