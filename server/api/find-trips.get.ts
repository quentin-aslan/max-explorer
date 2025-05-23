import type { ConnectionProperties } from '~/server/domains/trips/find-trips.use-case'
import { FindTripsUseCase } from '~/server/domains/trips/find-trips.use-case'
import { parseISODate } from '~/server/utils/dateUtils'
import { TrainsRepositoryPostgres } from '~/server/domains/trains/adapters/trains.repository.postgres'
import { getPgPool } from '~/server/utils/postgres-db'
import {
  TrainStationsRepositoryPostgres,
} from '~/server/domains/train-stations/adapters/train-stations.repository.postgres'

export default defineEventHandler(async (event) => {
  try {
    const { origin, departureDate, directOnly, destination, returnDate }: any = getQuery(event)

    const endTimer = metricsService.startTimerFindTrips({
      method: event.method,
      route: '/api/find-trips',
      origin,
      destination,
      departureDate,
      returnDate,
      directOnly,
    })

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
      maxConnectionTimeMinutes: 120,
    }

    const findTripsUseCase = new FindTripsUseCase(
      new TrainsRepositoryPostgres(getPgPool()),
      new TrainStationsRepositoryPostgres(getPgPool()),
      connectionProperties,
    )

    const trips = await findTripsUseCase.execute({
      origin,
      departureDate: departureDateFormatted,
      directOnly: (directOnly !== 'false'),
      destination,
      returnDate: returnDateFormatted,
    })

    const duration = endTimer(200)
    console.log(`Find trips took ${duration.toFixed(3)}s`)

    return trips
  }
  catch (e) {
    console.log(e)
    return 'ERROR'
  }
})
