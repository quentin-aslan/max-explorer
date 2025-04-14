import type { TrainStation } from '~/server/domains/train-stations/entities/train-station'
import type { Journey } from '~/server/domains/trips/entities/Journey'

export interface Trip {
  destinationName: string
  trainStation: TrainStation
  departureJourneys: Journey[]
  returnJourneys: Journey[]
}
