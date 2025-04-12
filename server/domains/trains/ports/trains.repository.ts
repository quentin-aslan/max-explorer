import type { Train } from '~/server/domains/trains/entities/train'

export interface TrainsRepository {
  insertTrain(train: Train): void
  deleteAllEntries(): void
  insertManyTrains(trains: Train[]): void
}
