import type { Journey } from '~/server/domains/trips/entities/Journey'

export interface JourneySortByDestination {
  destinationName: string
  journeys: Journey[]
}
