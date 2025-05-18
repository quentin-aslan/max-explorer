import type { TrainStation } from '~/domains/train-stations/entities/train-station'
import type { JourneyViewModel } from '~/domains/trips/entities/view-models/journey.view-model'

export interface TripViewModel {
  destinationName: string
  trainStation: TrainStation
  departureJourneys: JourneyViewModel[]
  returnJourneys: JourneyViewModel[]
}
