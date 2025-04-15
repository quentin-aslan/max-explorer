import type { DateTime } from 'luxon'
import type { Trip } from '~/domains/trips/entities/trip'

export interface FindTripsParameters {
  origin: string
  departureDate: DateTime
  directOnly: boolean
  destination?: string
  returnDate?: DateTime
}

export interface TripsRepository {
  findTrips(params: FindTripsParameters): Promise<Trip[]>
}
