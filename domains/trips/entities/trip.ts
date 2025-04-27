import type { TrainStation } from '~/domains/train-stations/entities/train-station'
import type { Train } from '~/domains/trips/entities/train'

export type Journey = Train[]

export interface Trip {
  destinationName: string
  trainStation: TrainStation
  departureJourneys: Journey[]
  returnJourneys: Journey[]
}
