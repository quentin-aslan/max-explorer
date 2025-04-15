import type { Train } from '~/domains/trips/entities/train'

export interface TrainViewModel extends Train {
  nightTrain: boolean
}
