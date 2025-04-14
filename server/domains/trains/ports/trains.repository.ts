import type { DateTime } from 'luxon'
import type { Train } from '~/server/domains/trains/entities/train'

export interface TrainsRepository {
  insertTrain(train: Train): void
  deleteAllEntries(): void
  insertManyTrains(trains: Train[]): void
  getTrains(filters: GetTrainsFilters): Train[]
}

export interface GetTrainsFilters {
  origin: string
  departureDate: DateTime
  destination?: string
  returnDate?: DateTime
  excludeDestination?: string
}
