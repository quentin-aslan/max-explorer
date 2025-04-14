import type { DateTime } from 'luxon'
import type { Train } from '~/server/domains/trains/entities/train'

export interface TrainsRepository {
  insertTrain(train: Train): Promise<void> | void
  deleteAllEntries(): Promise<void> | void
  insertManyTrains(trains: Train[]): Promise<void> | void
  getTrains(filters: GetTrainsFilters): Promise<Train[]> | Train[]
}

export interface GetTrainsFilters {
  origin: string
  departureDate: DateTime
  destination?: string
  returnDate?: DateTime
  excludeDestination?: string
}
