import { defineEventHandler, createError } from 'h3'
import { ImportTrainsUseCase } from '~/server/domains/trains/import-trains.use-case'
import { TrainsSncfRepositoryAxios } from '~/server/domains/trains/adapters/trains-sncf.repository.axios'
import { TrainsRepositorySqlite } from '~/server/domains/trains/adapters/trains.repository.sqlite'
import { sqliteDb } from '~/server/utils/sqlite-db'

export default defineEventHandler(async () => {
  try {
    const importTrainsUseCase = new ImportTrainsUseCase(
      new TrainsSncfRepositoryAxios(),
      new TrainsRepositorySqlite(sqliteDb),
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
