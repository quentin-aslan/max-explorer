import { defineCronHandler } from '#nuxt/cron'
import { ImportTrainStationsUseCase } from '~/server/domains/train-stations/import-train-stations.use-case'
import {
  TrainStationsSncfRepositoryAxios,
} from '~/server/domains/train-stations/adapters/train-stations-sncf.repository.axios'
import { TrainStationsRepositorySqlite } from '~/server/domains/train-stations/adapters/train-stations.repository.sqlite'
import { ImportTrainsUseCase } from '~/server/domains/trains/import-trains.use-case'
import { TrainsSncfRepositoryAxios } from '~/server/domains/trains/adapters/trains-sncf.repository.axios'
import { TrainsRepositorySqlite } from '~/server/domains/trains/adapters/trains.repository.sqlite'
import { sqliteDb } from '~/server/utils/sqlite-db'

export default defineCronHandler(() => '0 7 * * *', async () => {
  try {
    console.log('Running CRON import...')

    // Import train stations
    const importTrainStationsUseCase = new ImportTrainStationsUseCase(
      new TrainStationsSncfRepositoryAxios(),
      new TrainStationsRepositorySqlite(sqliteDb),
    )
    const importDestinationMsg = await importTrainStationsUseCase.execute()
    console.log(importDestinationMsg)

    // Import trains
    const importTrainsUseCase = new ImportTrainsUseCase(
      new TrainsSncfRepositoryAxios(),
      new TrainsRepositorySqlite(sqliteDb),
    )
    const importTrainsMsg = await importTrainsUseCase.execute()
    console.log(importTrainsMsg)
  }
  catch (e) {
    console.error(e)
  }
  finally {
    console.log('CRON finished.')
  }
}, { runOnInit: true })
