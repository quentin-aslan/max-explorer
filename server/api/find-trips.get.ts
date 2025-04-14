import { DateTime } from 'luxon'
import { TrainsRepositorySqlite } from '~/server/domains/trains/adapters/trains.repository.sqlite'
import { TrainStationsRepositorySqlite } from '~/server/domains/train-stations/adapters/train-stations.repository.sqlite'
import type { ConnectionProperties } from '~/server/domains/trips/find-trips.use-case'
import { FindTripsUseCase } from '~/server/domains/trips/find-trips.use-case'
import { parseISODate } from '~/server/utils/dateUtils'
import { sqliteDb } from '~/server/utils/sqlite-db'

export default defineEventHandler(async (event) => {
  const { origin, departureDate, directOnly, destination, returnDate }: any = getQuery(event)

  const startPerformance = DateTime.now()

  if (!origin || !departureDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Origin and departure date are required',
    })
  }

  const departureDateFormatted = parseISODate(departureDate)
  const returnDateFormatted = returnDate ? parseISODate(returnDate) : undefined

  if (returnDateFormatted && (departureDateFormatted > returnDateFormatted)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Departure date must be before return date',
    })
  }

  const connectionProperties: ConnectionProperties = {
    minConnectionTimeSameStationMinutes: 10,
    minConnectionTimeSameCityMinutes: 20,
    maxConnectionTimeMinutes: 50000,
  }

  const findTripsUseCase = new FindTripsUseCase(
    new TrainsRepositorySqlite(sqliteDb),
    new TrainStationsRepositorySqlite(sqliteDb),
    connectionProperties,
  )

  const trips = findTripsUseCase.execute({
    origin,
    departureDate: departureDateFormatted,
    directOnly: (directOnly !== 'false'),
    destination,
    returnDate: returnDateFormatted,
  })

  const endPerformance = DateTime.now()
  const duration = endPerformance.diff(startPerformance, ['milliseconds']).milliseconds
  console.log(`Find trips took ${duration} ms`)

  return trips
})
