import type { Train } from '~/server/domains/trains/entities/train'

export interface TrainsSncfRepository {
  getTrains(): Promise<Train[]>
}
