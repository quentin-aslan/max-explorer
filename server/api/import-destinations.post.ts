import { defineEventHandler, createError } from 'h3'
import { ImportTrainStationsUseCase } from '~/server/domains/train-stations/import-train-stations.use-case'
import {
  TrainStationsSncfRepositoryAxios,
} from '~/server/domains/train-stations/adapters/train-stations-sncf.repository.axios'
import { TrainStationsRepositorySqlite } from '~/server/domains/train-stations/adapters/train-stations.repository.sqlite'
import { sqliteDb } from '~/server/utils/sqlite-db'

export default defineEventHandler(async () => {
  try {
    const importTrainStationsUseCase = new ImportTrainStationsUseCase(
      new TrainStationsSncfRepositoryAxios(),
      new TrainStationsRepositorySqlite(sqliteDb),
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
