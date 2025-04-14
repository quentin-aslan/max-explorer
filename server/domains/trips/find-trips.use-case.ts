import type { DateTime } from 'luxon'
import type { GetTrainsFilters, TrainsRepository } from '~/server/domains/trains/ports/trains.repository'
import type { Journey } from '~/server/domains/trips/entities/Journey'
import type { Train } from '~/server/domains/trains/entities/train'
import type { Trip } from '~/server/domains/trips/entities/Trip'
import type { TrainStationsRepository } from '~/server/domains/train-stations/ports/train-stations.repository'
import { toMillis } from '~/server/utils/dateUtils'
import type { JourneySortByDestination } from '~/server/domains/trips/entities/JourneySortByDestination'

const MIN_CONNECTION_TIME_SAME_STATION_MINUTES = 15
const MIN_CONNECTION_TIME_SAME_CITY_MINUTES = 60
const MAX_CONNECTION_TIME_MINUTES = 120

export interface ConnectionProperties {
  minConnectionTimeSameStationMinutes: number
  minConnectionTimeSameCityMinutes: number
  maxConnectionTimeMinutes: number
}

export interface FindTripsExecuteParams {
  origin: string
  departureDate: DateTime
  directOnly: boolean
  destination?: string
  returnDate?: DateTime
}

export class FindTripsUseCase {
  constructor(
    private readonly trainsRepository: TrainsRepository,
    private readonly trainStationsRepository: TrainStationsRepository,
    private readonly connectionProperties: ConnectionProperties = {
      minConnectionTimeSameStationMinutes: MIN_CONNECTION_TIME_SAME_STATION_MINUTES,
      minConnectionTimeSameCityMinutes: MIN_CONNECTION_TIME_SAME_CITY_MINUTES,
      maxConnectionTimeMinutes: MAX_CONNECTION_TIME_MINUTES,
    },
  ) {}

  public async execute(
    params: FindTripsExecuteParams,
  ): Promise<Trip[]> {
    const { origin, departureDate, directOnly, destination, returnDate } = params

    console.log(`findTripsUseCase (origin: ${origin}, destination: ${destination}, departureDate: ${departureDate}, returnDate: ${returnDate}, directOnly: ${directOnly})`)
    const errors: string[] = [] // List all error occurred and log it.

    // 1. Find the train from the origin to the destination if specified
    const journeySortByDestinationFromOrigin = await this
      .findJourneys(origin, departureDate, directOnly, destination)

    // console.log(`journeySortByDestinationFromOrigin: ${JSON.stringify(journeySortByDestinationFromOrigin)}`)

    // 1.1 If no train is found, return an empty array
    if (journeySortByDestinationFromOrigin.length === 0) {
      console.log(`No train found from ${origin} to ${destination || 'any destination'}`)
      errors.push(`No train found from ${origin} to ${destination || 'any destination'}`)
      return []
    }

    const originFormatted = journeySortByDestinationFromOrigin[0]?.journeys[0][0]?.origin //  // The origin property given by the user is not always the same as the train's origin property, he can write "Toulouse" instead of "TOULOUSE MATABIAU"

    // 2. Create the Trips object and merge journeySortByDestinationFromOrigin with the train stations details
    const trips: Trip[] = [] // This object will be returned by the function.

    const trainStationsWithTraffic = await this.trainStationsRepository.getTrainStations({})
    for (const journeys of journeySortByDestinationFromOrigin) {
      const normalizedDestinationName = this.normalizeName(journeys.destinationName)
      // 2.1 Find the train stations details
      let trainStation = trainStationsWithTraffic.find(station => station.name.includes(normalizedDestinationName))
      if (!trainStation) {
        errors.push(`Train station not found for ${journeys.destinationName}`)
        trainStation = {
          name: journeys.destinationName,
          latitude: 0,
          longitude: 0,
          traffic: 0,
        }
      }

      // 2.3 Create the Trip object
      const trip: Trip = {
        destinationName: journeys.destinationName,
        trainStation,
        departureJourneys: journeys.journeys,
        returnJourneys: [],
      }
      trips.push(trip)
    }

    // 3. Search for the return trips if the return date is specified
    if (returnDate) {
      // 3.1 If the destination is specified search only a round trip to the destination
      if (destination) {
        // console.log(`Searching for return trip from ${destination} to ${originFormatted}`)

        const returnTrips = await this.findJourneys(
          destination,
          returnDate,
          directOnly,
          undefined,
          originFormatted,
        )

        /*
          returnTrips is an array of JourneySortByDestination,
          we just need the one with the same destinationName as the origin provided by the user.
         */
        const returnTrip = returnTrips.find(rt => rt.destinationName === originFormatted)
        // console.log(`Return trip found: ${JSON.stringify(returnTrip)}`)

        if (returnTrip) {
          const trip = trips[0]
          if (trip) {
            trip.returnJourneys = returnTrip.journeys
          }
        }
      }
      else {
        // 3.2 If the destination is not specified search for all the trips
        for (const trip of trips) {
          // console.log(`Searching for return trip from ${trip.destinationName} to ${originFormatted}`)

          const returnTrips = await this.findJourneys(
            trip.destinationName,
            returnDate,
            directOnly,
            undefined,
            originFormatted,
          )

          /*
            returnTrips is an array of JourneySortByDestination,
            we just need the one with the same destinationName as the origin provided by the user.
           */
          const returnTrip = returnTrips.find(rt => rt.destinationName === originFormatted)
          if (returnTrip) {
            trip.returnJourneys = returnTrip.journeys
          }
        }
      }
    }

    // 4. Return the result
    const results = (returnDate ? trips.filter(trip => trip.returnJourneys.length > 0) : trips)
    console.log(`findTripsUseCase (${origin}, ${destination}, ${departureDate}, ${returnDate}, directOnly: ${directOnly}) finished with ${results.length} trips found`)
    return results
  }

  /*
    There are two destination-related properties: `destination` (user input) and `destinationFormatted` (inferred from direct train data).
    This distinction is necessary because on the initial call to `findJourneys` (for outbound trips), the destination names provided by the user
    usually match the train data directly. However, when retrieving return journeys, the origin becomes the new destination, and the names in
    the train data may not match the original user input (ex: Toulouse, TOULOUSE MATABIAU).
    `destinationFormatted` ensures consistency when comparing journey destinations across different directions.

    (I hope this comment is clear enough, if not, please ask me to clarify, quentin.aslan@outlook.com)
  */
  private async findJourneys(
    origin: string,
    departureDate: DateTime,
    directOnly: boolean,
    destination?: string, // Destination provided by a third party, so we can not trust it, we need to format it.
    destinationFormatted?: string, // This field can be trusted, its provided by the app.
  ): Promise<JourneySortByDestination[]> {
    console.log(`FIND_JOURNEYS (origin: ${origin}, departureDate: ${departureDate}, directOnly: ${directOnly}, destination: ${destination}, destinationFormatted: ${destinationFormatted})`)
    let allDestinationsJourneys: JourneySortByDestination[] = [] // This table will be returned by the function. It's include all the direct trains and the connection trains sorted by destination.

    // 1. Get all the trains from the origin
    const filters: GetTrainsFilters = {
      origin,
      departureDate,
      destination: (directOnly ? destination ?? destinationFormatted : undefined), // optional
    }
    const directTrainsFromOrigin = await this.trainsRepository.getTrains(filters)

    const originFormatted = directTrainsFromOrigin[0]?.origin

    const directDestinationsJourneys: JourneySortByDestination[] = []

    // 2. Add the direct trains to the destination table
    for (const directTrain of directTrainsFromOrigin) {
      const destinationObj = this.getOrAddDestinationJourneys(directDestinationsJourneys, directTrain.destination)
      destinationObj.journeys.push([directTrain])
    }

    // 3. Get the connection trains (Only one connection is managed) // TODO: On pourrais ameliorer en prenant l'heure d'arriver du dernier trains dans la ville et faire en sorte que on cherche les trains seulement apres cette heure (ex: Toulouse -> Montauban -> Paris. On cherche les trains de Montauban vers Paris seulement apres l'heure d'arriver du train de Toulouse vers Montauban)
    if (!directOnly) {
      allDestinationsJourneys = await this.getConnectionJourneys(directDestinationsJourneys, departureDate, destination, destinationFormatted, originFormatted)
    }

    // 4. Remove duplicates
    for (const journey of allDestinationsJourneys) {
      journey.journeys = this.removeDuplicates(journey.journeys)
    }

    // 5. If a destination is specified, return only the journeys to that destination / !! Attention, le .includes() est un peu bancale, pour le moment aucun autre moyen de gerer ça, sauf si on oblige l'utilisateur a utiliser le nom d'une gare deja dans notre base de données.
    if (!destinationFormatted && destination) {
      destinationFormatted = directTrainsFromOrigin
        .find(train => train.destination.toLowerCase().includes(destination?.toLowerCase()))?.destination
      // console.log(`destination: ${destination} destinationFormatted: ${destinationFormatted}`)
    }

    return (destination || destinationFormatted ? allDestinationsJourneys.filter(journey => journey.destinationName === destinationFormatted) : allDestinationsJourneys)
  }

  private async getConnectionJourneys(
    directJourneys: JourneySortByDestination[],
    departureDate: DateTime,
    destination?: string,
    destinationFormatted?: string,
    originFormatted?: string,
  ): Promise<JourneySortByDestination[]> {
    const connectionPromises = directJourneys.map((directJourney) => {
      const d = destination ?? destinationFormatted

      const filters: GetTrainsFilters = {
        origin: directJourney.destinationName,
        departureDate,
        destination: d,
        excludeDestination: originFormatted,
      }

      // console.log(`GET_CONNECTION_FETCH from ${directJourney.destinationName} ${(d) ? 'to ' + d : ''} `)

      return this.trainsRepository.getTrains(filters)
    })

    // Attend toutes les réponses simultanément
    const connectionResults = await Promise.all(connectionPromises)

    const allDestinationsJourneys: JourneySortByDestination[] = []

    connectionResults.forEach((connectionTrains, index) => {
      const directJourney = directJourneys[index]

      const connectionJourneys: JourneySortByDestination[] = []

      directJourney.journeys.forEach((journey) => {
        const departureTrain = journey[0]
        connectionTrains.forEach((connectionTrain) => {
          if (this.isConnectionValid(departureTrain, connectionTrain)) {
            const destinationObj = this.getOrAddDestinationJourneys(connectionJourneys, connectionTrain.destination)
            destinationObj.journeys.push([...journey, connectionTrain])
          }
        })
      })

      for (const connectionJourney of connectionJourneys) {
        const destinationObj = this.getOrAddDestinationJourneys(allDestinationsJourneys, connectionJourney.destinationName)
        destinationObj.journeys.push(...connectionJourney.journeys)
      }
    })

    for (const directJourney of directJourneys) {
      const destinationObj = this.getOrAddDestinationJourneys(allDestinationsJourneys, directJourney.destinationName)
      destinationObj.journeys.push(...directJourney.journeys)
    }

    return allDestinationsJourneys
  }

  /**
   * The trips are grouped by destination. This function checks if the destination is already in the table,
   */
  private getOrAddDestinationJourneys(destinationsTable: JourneySortByDestination[], destinationName: string): JourneySortByDestination {
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

  /**
   * Checks if the connection between two trains is valid based on minimum and maximum
   * connection times, depending on whether they are at the same station or just in the same city.
   */
  private isConnectionValid(
    departureTrain: Train,
    connectionTrain: Train,
  ): boolean {
    const minTimeSameStationMs = this.connectionProperties.minConnectionTimeSameStationMinutes * 60 * 1000
    const minTimeSameCityMs = this.connectionProperties.minConnectionTimeSameCityMinutes * 60 * 1000
    const maxTimeMs = this.connectionProperties.maxConnectionTimeMinutes * 60 * 1000

    const connectionTimeMs
        = toMillis(connectionTrain.departureDateTime) - toMillis(departureTrain.arrivalDateTime)

    if (connectionTimeMs < 0) return false

    const isSameStation = departureTrain.destinationIata === connectionTrain.originIata

    if (isSameStation && connectionTimeMs < minTimeSameStationMs) return false
    if (!isSameStation && connectionTimeMs < minTimeSameCityMs) return false

    // Ensure the connection time does not exceed the maximum allowed time
    return connectionTimeMs <= maxTimeMs
  }

  private normalizeName(name: string) {
    return name.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/ç/g, 'c')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ýÿ]/g, 'y')
      .replace(/-/g, ' ')
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim()?.split(' ')[0]
  }

  private removeDuplicates(journeys: Journey[]): Journey[] {
    // Remove duplicates based on train numbers, origin and destination
    const uniqueJourneys = new Map<string, Journey>()

    for (const journey of journeys) {
      // Crée une "signature" unique pour chaque journey en concaténant les infos clés de chaque train
      const journeyKey = journey
        .map(train => `${train.trainNo}-${train.origin}-${train.destination}`)
        .sort() // Pour éviter que l'ordre des trains dans un journey influence l'unicité
        .join('|')

      if (!uniqueJourneys.has(journeyKey)) {
        uniqueJourneys.set(journeyKey, journey)
      }
    }

    return Array.from(uniqueJourneys.values())
  }
}
