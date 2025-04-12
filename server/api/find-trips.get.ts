// server/api/findRoundTrips.ts

import type { RoundTripDestination, AdaptedTrainData, DestinationJourneys } from '~/types/common.ts'
import { normalizeName } from '~/server/utils'

const MIN_CONNECTION_TIME_SAME_STATION_MINUTES = 15
const MIN_CONNECTION_TIME_SAME_CITY_MINUTES = 60
const MAX_CONNECTION_TIME_MINUTES = 120

const getOrAddDestinationJourneys = (destinationsTable: DestinationJourneys[], destinationName: string): DestinationJourneys => {
  let destination = destinationsTable.find(dest => dest.destinationName === destinationName)
  if (!destination) {
    destination = { destinationName, journeys: [] }
    destinationsTable.push(destination)
  }
  return destination
}

const isConnectionValid = (
  departureTrain: AdaptedTrainData,
  connectionTrain: AdaptedTrainData,
  minSameStation: number,
  minSameCity: number,
  maxTime: number,
): boolean => {
  const minStation = minSameStation * 60 * 1000
  const minCity = minSameCity * 60 * 1000
  const max = maxTime * 60 * 1000
  const connectionTime = connectionTrain.departureDateTime - departureTrain.arrivalDateTime
  if (connectionTime < 0) return false
  const sameStation = departureTrain.destinationIata === connectionTrain.originIata
  if (sameStation && connectionTime < minStation) return false
  if (!sameStation && connectionTime < minCity) return false
  return connectionTime <= max
}

const queryTrains = (where: any): AdaptedTrainData[] => {
  const rows = sqliteDb.prepare(`
    SELECT * FROM train
    WHERE origin LIKE ?
      AND departureDateTime BETWEEN ? AND ?
      AND isEligibleForMaxSubscription = 1
      ${where.destination ? 'AND destination LIKE ?' : ''}
      ${where.excludeDestination ? 'AND destination != ?' : ''}
  `).all(
    `%${where.origin}%`,
    where.start.toISOString(),
    where.end.toISOString(),
    ...(where.destination ? [`%${where.destination}%`] : []),
    ...(where.excludeDestination ? [where.excludeDestination] : []),
  )
  return rows.map((row: any) => ({ ...row, departureDateTime: new Date(row.departureDateTime).getTime(), arrivalDateTime: new Date(row.arrivalDateTime).getTime() }))
}

const findRoute = (
  origin: string,
  destination: string | null,
  departureDate: Date,
  minStation: number,
  minCity: number,
  maxTime: number,
): DestinationJourneys[] | DestinationJourneys => {
  const allDestinations: DestinationJourneys[] = []
  const start = new Date(departureDate.setHours(0, 0, 0, 0))
  const end = new Date(departureDate.setHours(23, 59, 59, 999))

  const directTrains = queryTrains({ origin, start, end })
  const originFormatted = directTrains[0]?.origin

  const directJourneys: DestinationJourneys[] = []
  for (const train of directTrains) {
    const dest = getOrAddDestinationJourneys(directJourneys, train.destination)
    dest.journeys.push([train])
  }

  for (const direct of directJourneys) {
    const connectionTrains = queryTrains({
      origin: direct.destinationName,
      start,
      end,
      destination,
      excludeDestination: originFormatted,
    })

    const connectionJourneys: DestinationJourneys[] = []
    for (const journey of direct.journeys) {
      for (const connection of connectionTrains) {
        const lastTrain = journey[journey.length - 1]
        if (isConnectionValid(lastTrain, connection, minStation, minCity, maxTime)) {
          const newJourney = [...journey, connection]
          const dest = getOrAddDestinationJourneys(connectionJourneys, connection.destination)
          dest.journeys.push(newJourney)
        }
      }
    }

    for (const conn of connectionJourneys) {
      const dest = getOrAddDestinationJourneys(allDestinations, conn.destinationName)
      dest.journeys.push(...conn.journeys)
    }
  }

  for (const direct of directJourneys) {
    const dest = getOrAddDestinationJourneys(allDestinations, direct.destinationName)
    dest.journeys.push(...direct.journeys)
  }

  return destination
    ? allDestinations.find(d => d.destinationName.toLowerCase().includes(destination.toLowerCase()))!
    : allDestinations
}

const findRoundTrips = async (
  origin: string,
  destination: string | null,
  departureDate: Date,
  returnDate?: Date,
  minStation: number = MIN_CONNECTION_TIME_SAME_STATION_MINUTES,
  minCity: number = MIN_CONNECTION_TIME_SAME_CITY_MINUTES,
  maxTime: number = MAX_CONNECTION_TIME_MINUTES,
): Promise<RoundTripDestination[]> => {
  const result: RoundTripDestination[] = []
  const departureRoutes = findRoute(origin, destination, departureDate, minStation, minCity, maxTime)

  const routes = Array.isArray(departureRoutes) ? departureRoutes : [departureRoutes]
  for (const route of routes) {
    const dest: RoundTripDestination = {
      destinationName: route.destinationName,
      departureJourneys: route.journeys,
      returnJourneys: [],
    }

    if (returnDate) {
      const returnRoute = findRoute(route.destinationName, origin, returnDate, minStation, minCity, maxTime)
      if (returnRoute) {
        dest.returnJourneys = Array.isArray(returnRoute) ? returnRoute.find(r => r.destinationName === origin)?.journeys ?? [] : returnRoute.journeys
      }
    }

    const norm = normalizeName(dest.destinationName)?.split(' ')[0]
    const station = sqliteDb.prepare('SELECT * FROM trainStation WHERE name LIKE ? LIMIT 1').get(`%${norm}%`)
    if (station) {
      dest.traffic = station.traffic
      dest.latitude = station.latitude
      dest.longitude = station.longitude
    }

    result.push(dest)
  }

  return result
}

export default defineEventHandler(async (event) => {
  const { origin, destination, departureDate, returnDate }: any = getQuery(event)
  if (!origin || !departureDate) throw createError({ statusCode: 400, statusMessage: 'Origin and departure date are required' })

  const departure = new Date(departureDate)
  const ret = returnDate ? new Date(returnDate) : undefined
  if (ret && departure > ret) throw createError({ statusCode: 400, statusMessage: 'Departure date must be before return date' })

  try {
    return await findRoundTrips(origin, destination, departure, ret)
  }
  catch (e) {
    console.error(e)
    return []
  }
})
