import { defineEventHandler, createError } from 'h3'
import { ImportTrainsUseCase } from '~/server/domains/trains/import-trains.use-case'
import { TrainsSncfRepositoryAxios } from '~/server/domains/trains/adapters/trains-sncf.repository.axios'
import { TrainsRepositoryPostgres } from '~/server/domains/trains/adapters/trains.repository.postgres'

export default defineEventHandler(async () => {
  try {
    const importTrainsUseCase = new ImportTrainsUseCase(
      new TrainsSncfRepositoryAxios(),
      new TrainsRepositoryPostgres(getPgPool()),
    )

    return await importTrainsUseCase.execute()
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred during data import.',
    })
  }
})
