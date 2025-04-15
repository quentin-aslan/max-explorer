import type { Trip } from '~/domains/trips/entities/trip'

export interface TripsPresenter {
  present(trip: Trip[]): void
  presentError(error: string): void
}
