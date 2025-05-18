import { defineEventHandler, createError } from 'h3'
import { ImportTrainStationsUseCase } from '~/server/domains/train-stations/import-train-stations.use-case'
import {
  TrainStationsSncfRepositoryAxios,
} from '~/server/domains/train-stations/adapters/train-stations-sncf.repository.axios'
import {
  TrainStationsRepositoryPostgres,
} from '~/server/domains/train-stations/adapters/train-stations.repository.postgres'
import { getPgPool } from '~/server/utils/postgres-db'
import { TrainsRepositoryPostgres } from '~/server/domains/trains/adapters/trains.repository.postgres'

export default defineEventHandler(async () => {
  try {
    const importTrainStationsUseCase = new ImportTrainStationsUseCase(
      new TrainStationsSncfRepositoryAxios(),
      new TrainStationsRepositoryPostgres(getPgPool()),
      new TrainsRepositoryPostgres(getPgPool()),
    )

    return await importTrainStationsUseCase.execute()
  }
  catch (e) {
    console.log(e)
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred during data import.',
    })
  }
})
