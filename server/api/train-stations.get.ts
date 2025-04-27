import GetTrainStationsUseCase from '~/server/domains/train-stations/get-train-stations.use-case'
import {
  TrainStationsRepositoryPostgres,
} from '~/server/domains/train-stations/adapters/train-stations.repository.postgres'
import { getPgPool } from '~/server/utils/postgres-db'

export default defineEventHandler(async () => {
  const getTrainStationsUseCase = new GetTrainStationsUseCase(
    new TrainStationsRepositoryPostgres(getPgPool()),
  )

  return await getTrainStationsUseCase.execute()
})
