import type { TripsRepository } from '~/domains/trips/ports/trips.repository'
import type { Trip } from '~/domains/trips/entities/trip'

export class TripsRepositoryMock implements TripsRepository {
  constructor(private readonly tripsToReturn: Trip[] | string) {
  }

  async findTrips(): Promise<Trip[]> {
    if (typeof this.tripsToReturn === 'string') {
      throw new Error('Error throw by TripsRepositoryMock')
    }

    return this.tripsToReturn
  }
}
