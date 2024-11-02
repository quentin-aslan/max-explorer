import type { RoundTripDestination, AdaptedTrainData, DestinationJourneys } from '~/server/train-type'
import prisma from '~/lib/prisma'

const MIN_CONNECTION_TIME_SAME_STATION_MINUTES = 15
const MIN_CONNECTION_TIME_SAME_CITY_MINUTES = 60
const MAX_CONNECTION_TIME_MINUTES = 800

const getOrAddDestinationJourneys = (destinationsTable: DestinationJourneys[], destinationName: string): DestinationJourneys => {
  let destination = destinationsTable.find(dest => dest.destinationName === destinationName)

  // If the destination is not in the table, create it
  if (!destination) {
    destination = {
      destinationName,
      journeys: [],
    }
    destinationsTable.push(destination)
  }
  return destination
}

const isConnectionValid = (
  departureTrain: AdaptedTrainData,
  connectionTrain: AdaptedTrainData,
  minConnectionTimeSameStationMinutes: number,
  minConnectionTimeSameCityMinutes: number,
  maxConnectionTimeMinutes: number,
): boolean => {
  const minConnectionTimeSameStation = minConnectionTimeSameStationMinutes * 60 * 1000
  const minConnectionTimeSameCity = minConnectionTimeSameCityMinutes * 60 * 1000
  const maxConnectionTime = maxConnectionTimeMinutes * 60 * 1000
  const isSameStation = departureTrain.destinationIata === connectionTrain.originIata

  const connectionTime = connectionTrain.departureDateTime - departureTrain.arrivalDateTime

  if (connectionTime < 0) return false
  if (isSameStation && connectionTime < minConnectionTimeSameStation) return false
  if (!isSameStation && connectionTime < minConnectionTimeSameCity) return false
  if (connectionTime > maxConnectionTime) return false
  console.log(`Connection time : ${connectionTrain.origin} to ${connectionTrain.destination} : ${connectionTime / 1000 / 60} minutes`)
  return true
}

const findRoute = async (
  origin: string,
  destination: string | null = null,
  departureDate: Date,
  minConnectionTimeSameStationMinutes: number = MIN_CONNECTION_TIME_SAME_STATION_MINUTES,
  minConnectionTimeSameCityMinutes: number = MIN_CONNECTION_TIME_SAME_CITY_MINUTES,
  maxConnectionTimeMinutes: number = MAX_CONNECTION_TIME_MINUTES,
) => {
  // console.log(`findRoute(${origin}, ${destination}, ${departureDate}) started`)
  const allDestinationsJourneys: DestinationJourneys[] = []

  // Get all direct train from the origin station
  const directTrainsFromOrigin = await prisma.train.findMany({
    where: {
      origin: {
        contains: origin,
      },
      departureDateTime: {
        gte: new Date(new Date(departureDate).setHours(0, 0, 0, 0)),
        lte: new Date(new Date(departureDate).setHours(23, 59, 59, 999)),
      },
      isEligibleForMaxSubscription: true,
    },
  }) as AdaptedTrainData[]

  const originFormatted = directTrainsFromOrigin[0]?.origin

  const directJourneys: DestinationJourneys[] = []

  // Add the direct trains to the destination table
  for (const directTrain of directTrainsFromOrigin) {
    const destinationObj = getOrAddDestinationJourneys(directJourneys, directTrain.destination)
    destinationObj.journeys.push([directTrain])
  }

  // For each direct train, get all the connection trains
  for (const directJourney of directJourneys) {
    // Get all the connection trains from the destination of the direct train
    const where = {
      origin: {
        contains: directJourney.destinationName,
      },
      departureDateTime: {
        gte: new Date(new Date(departureDate).setHours(0, 0, 0, 0)),
        lte: new Date(new Date(departureDate).setHours(23, 59, 59, 999)),
      },
      destination: {
        not: originFormatted,
      },
      isEligibleForMaxSubscription: true,
    }

    if (destination) {
      where.destination.contains = destination
    }

    const connectionTrains = await prisma.train.findMany({
      where,
    }) as AdaptedTrainData[]

    const connectionJourneys: DestinationJourneys[] = []

    for (const journey of directJourney.journeys) {
      if (journey.length === 0) continue
      for (const connectionTrain of connectionTrains) {
        const departureTrain = journey[journey.length - 1]
        if (isConnectionValid(departureTrain, connectionTrain, minConnectionTimeSameStationMinutes, minConnectionTimeSameCityMinutes, maxConnectionTimeMinutes)) {
          const connectionJourney = [...journey, connectionTrain]
          const connectionDestination = getOrAddDestinationJourneys(connectionJourneys, connectionTrain.destination)
          connectionDestination.journeys.push(connectionJourney)
        }
      }
    }

    for (const connectionJourney of connectionJourneys) {
      const destinationObj = getOrAddDestinationJourneys(allDestinationsJourneys, connectionJourney.destinationName)
      destinationObj.journeys.push(...connectionJourney.journeys)
    }
  }

  for (const directJourney of directJourneys) {
    const destinationObj = getOrAddDestinationJourneys(allDestinationsJourneys, directJourney.destinationName)
    destinationObj.journeys.push(...directJourney.journeys)
  }

  console.log(`allDestinationsJourneys with origine ${originFormatted} : `, allDestinationsJourneys.length)

  if (destination) {
    return allDestinationsJourneys.find(dest => dest.destinationName.toLowerCase().includes(destination.toLowerCase()))
  }
  return allDestinationsJourneys
}

const findRoundTrips = async (
  origin: string,
  destination: string | null = null,
  departureDate: Date,
  returnDate: Date,
  minConnectionTimeSameStationMinutes: number = MIN_CONNECTION_TIME_SAME_STATION_MINUTES,
  minConnectionTimeSameCityMinutes: number = MIN_CONNECTION_TIME_SAME_CITY_MINUTES,
  maxConnectionTimeMinutes: number = MAX_CONNECTION_TIME_MINUTES,
): RoundTripDestination[] => {
  console.log(`findRoundTrips(${origin}, ${destination}, ${departureDate}, ${returnDate}) started`)
  const roundTripsDestinations: RoundTripDestination[] = []

  // Get all the destinations from the origin
  const departureDestinations = await findRoute(origin, destination, departureDate, minConnectionTimeSameStationMinutes, minConnectionTimeSameCityMinutes, maxConnectionTimeMinutes)

  // If the destination is specified, only look for a round trip to this destination
  if (destination) {
    if (!departureDestinations) return null
    const returnDestination = await findRoute(destination, origin, returnDate, minConnectionTimeSameStationMinutes, minConnectionTimeSameCityMinutes, maxConnectionTimeMinutes)
    if (!returnDestination) return null

    roundTripsDestinations.push({
      destinationName: destination,
      departureJourneys: (departureDestinations as DestinationJourneys).journeys,
      returnJourneys: (returnDestination as DestinationJourneys).journeys },
    )

    return roundTripsDestinations
  }

  // If the destination is not specified, look for a round trip to all destinations
  let i = 0
  for (const departureDestination of departureDestinations) {
    i++
    console.log(`departureDestination ${i} : `, departureDestination.destinationName)
    const returnDestination = await findRoute(departureDestination.destinationName, origin, returnDate, minConnectionTimeSameStationMinutes, minConnectionTimeSameCityMinutes, maxConnectionTimeMinutes)
    console.log(`returnDestination : `, returnDestination)
    if (returnDestination) {
      roundTripsDestinations.push({ destinationName: departureDestination.destinationName, departureJourneys: departureDestination.journeys, returnJourneys: (returnDestination as DestinationJourneys).journeys })
    }
  }

  console.log(`roundTripsDestinations : `, roundTripsDestinations.length)
  return roundTripsDestinations
}

export default defineEventHandler(async (event) => {
  const { origin, destination, departureDate, returnDate }: Props = getQuery(event)

  if (!origin || !departureDate || !returnDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Origin, departure date and return date are required',
    })
  }

  const departureDateFormatted = new Date(departureDate)
  const returnDateFormatted = new Date(returnDate)

  if (departureDateFormatted >= returnDateFormatted) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Departure date must be before return date',
    })
  }

  try {
    return await findRoundTrips(origin, destination, departureDateFormatted, returnDateFormatted)
  }
  catch (e) {
    console.error(e)
    return []
  }
})
