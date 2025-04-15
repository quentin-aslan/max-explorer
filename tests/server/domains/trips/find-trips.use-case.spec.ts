import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { FindTripsUseCase } from '~/server/domains/trips/find-trips.use-case'
import type { Train } from '~/server/domains/trains/entities/train'
import type { Trip } from '~/server/domains/trips/entities/Trip'
import type { Journey } from '~/server/domains/trips/entities/Journey'
import type { TrainStation } from '~/server/domains/train-stations/entities/train-station'
import { parseISODate } from '~/server/utils/dateUtils'
import { PostgresTestManager } from '~/tests/postgres-test-manager'
import { TrainsRepositoryPostgres } from '~/server/domains/trains/adapters/trains.repository.postgres'
import {
  TrainStationsRepositoryPostgres,
} from '~/server/domains/train-stations/adapters/train-stations.repository.postgres'

// List of mock train journeys:
// - TOULOUSE → MONTAUBAN → PARIS (April 15, with 2 connections)
// - TOULOUSE → NARBONNE (April 15, direct)
// - TOULOUSE → PARIS (April 15, direct)
// - PARIS → TOULOUSE (April 23, direct)
// - PARIS → MONTAUBAN → TOULOUSE (April 23, with 1 connection)
// - MONTAUBAN → TOULOUSE (April 29, direct)
// - PARIS → BORDEAUX → TOULOUSE (April 29, with 1 connection)
const trainsMock: Train[] = [
  // TOULOUSE to PARIS 15/04 CONNECTION
  {
    date: parseISODate('2025-04-15T00:00:00.000Z'),
    origin: 'TOULOUSE MATABIAU',
    destination: 'MONTAUBAN VILLE BOURBON',
    trainNo: '8502',
    entity: 'SUDOUESTPA',
    axe: 'ATLANTIQUE',
    originIata: 'FRXYT',
    destinationIata: 'FRXMW',
    departureDateTime: parseISODate('2025-04-15T10:10:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-15T10:46:00.000Z'),
    isEligibleForMaxSubscription: true,
  },
  // 19 minutes for the connection in the same station
  {
    date: parseISODate('2025-04-15T00:00:00.000Z'),
    trainNo: '0001',
    entity: 'SUDOUESTPA',
    axe: 'ATLANTIQUE',
    originIata: 'FRXMW',
    destinationIata: 'FRPMO',
    origin: 'MONTAUBAN VILLE BOURBON',
    destination: 'PARIS (intramuros)',
    departureDateTime: parseISODate('2025-04-15T11:05:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-16T01:55:00.000Z'),
    isEligibleForMaxSubscription: true,
  },
  // 10 minutes for the connection in the same station
  {
    date: parseISODate('2025-04-15T00:00:00.000Z'),
    trainNo: '0002',
    entity: 'SUDOUESTPA',
    axe: 'ATLANTIQUE',
    originIata: 'FRXMW',
    destinationIata: 'FRPMO',
    origin: 'MONTAUBAN VILLE BOURBON',
    destination: 'PARIS (intramuros)',
    departureDateTime: parseISODate('2025-04-15T10:56:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-16T01:56:00.000Z'),
    isEligibleForMaxSubscription: true,
  },
  // TOULOUSE to NARBONNE 15/04 DIRECT
  {
    date: parseISODate('2025-04-15T00:00:00.000Z'),
    origin: 'TOULOUSE MATABIAU',
    destination: 'NARBONNE',
    trainNo: '0003',
    entity: 'JCSUDPROV',
    axe: 'SUD EST',
    originIata: 'FRXYT',
    destinationIata: 'FRXNA',
    departureDateTime: parseISODate('2025-04-15T11:39:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-15T12:54:00.000Z'),
    isEligibleForMaxSubscription: true,
  },

  // TOULOUSE to PARIS 15/04 DIRECT (x2, DUPLICATE)
  {
    date: parseISODate('2025-04-15T00:00:00.000Z'),
    trainNo: '0004',
    entity: 'SUDOUESTPA',
    axe: 'ATLANTIQUE',
    originIata: 'FRXYT',
    destinationIata: 'FRPMO',
    origin: 'TOULOUSE MATABIAU',
    destination: 'PARIS (intramuros)',
    departureDateTime: parseISODate('2025-04-15T15:09:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-15T17:55:00.000Z'),
    isEligibleForMaxSubscription: true,
  },
  {
    date: parseISODate('2025-04-15T00:00:00.000Z'),
    trainNo: '0004',
    entity: 'SUDOUESTPA',
    axe: 'ATLANTIQUE',
    originIata: 'FRXYT',
    destinationIata: 'FRPMO',
    origin: 'TOULOUSE MATABIAU',
    destination: 'PARIS (intramuros)',
    departureDateTime: parseISODate('2025-04-15T21:09:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-16T01:55:00.000Z'),
    isEligibleForMaxSubscription: true,
  },

  // PARIS to TOULOUSE 23/04 DIRECT
  {
    date: parseISODate('2025-04-23T00:00:00.000Z'),
    trainNo: '0005',
    entity: 'PASUDOUEST',
    axe: 'ATLANTIQUE',
    originIata: 'FRPMO',
    destinationIata: 'FRXYT',
    origin: 'PARIS (intramuros)',
    destination: 'TOULOUSE MATABIAU',
    departureDateTime: parseISODate('2025-04-23T10:06:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-23T14:44:00.000Z'),
    isEligibleForMaxSubscription: true,
  },

  // PARIS to TOULOUSE 23/04 CONNECTION at MONTAUBAN
  {
    date: parseISODate('2025-04-23T00:00:00.000Z'),
    trainNo: '0006',
    entity: 'PASUDOUEST',
    axe: 'ATLANTIQUE',
    originIata: 'FRPMO',
    destinationIata: 'FRXMW',
    origin: 'PARIS (intramuros)',
    destination: 'MONTAUBAN VILLE BOURBON',
    departureDateTime: parseISODate('2025-04-23T12:08:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-23T15:44:00.000Z'),
    isEligibleForMaxSubscription: true,
  },
  {
    date: parseISODate('2025-04-23T00:00:00.000Z'),
    trainNo: '0007',
    entity: 'PASUDOUEST',
    axe: 'ATLANTIQUE',
    originIata: 'FRXMW',
    destinationIata: 'FRXYT',
    origin: 'MONTAUBAN VILLE BOURBON',
    destination: 'TOULOUSE MATABIAU',
    departureDateTime: parseISODate('2025-04-23T16:02:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-23T20:44:00.000Z'),
    isEligibleForMaxSubscription: true,
  },

  // MONTAUBAN To Toulouse 29/04 DIRECT
  {
    date: parseISODate('2025-04-29T00:00:00.000Z'),
    trainNo: '0008',
    entity: 'SUDOUESTPA',
    axe: 'ATLANTIQUE',
    originIata: 'FRXMW',
    destinationIata: 'FRXYT',
    origin: 'MONTAUBAN VILLE BOURBON',
    destination: 'TOULOUSE MATABIAU',
    departureDateTime: parseISODate('2025-04-29T14:05:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-29T14:55:00.000Z'),
    isEligibleForMaxSubscription: true,
  },

  // Paris to Toulouse 29/04 CONNECTION AT BORDEAUX (20 mins of correspondance)
  {
    date: parseISODate('2025-04-29T00:00:00.000Z'),
    trainNo: '0009',
    entity: 'PASUDOUEST',
    axe: 'ATLANTIQUE',
    originIata: 'FRPMO',
    destinationIata: 'FRBOJ',
    origin: 'PARIS (intramuros)',
    destination: 'BORDEAUX ST JEAN',
    departureDateTime: parseISODate('2025-04-29T11:00:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-29T12:40:00.000Z'),
    isEligibleForMaxSubscription: true,
  },
  {
    date: parseISODate('2025-04-29T00:00:00.000Z'),
    trainNo: '0010',
    entity: 'PASUDOUEST',
    axe: 'ATLANTIQUE',
    originIata: 'FRBOJ',
    destinationIata: 'FRXYT',
    origin: 'BORDEAUX ST JEAN',
    destination: 'TOULOUSE MATABIAU',
    departureDateTime: parseISODate('2025-04-29T13:00:00.000Z'),
    arrivalDateTime: parseISODate('2025-04-29T16:05:00.000Z'),
    isEligibleForMaxSubscription: true,
  },
]

const trainStationsMock: TrainStation[] = [
  {
    name: 'toulouse matabiau',
    traffic: 22347985,
    latitude: 43.611206,
    longitude: 1.453616,
  },
  {
    name: 'narbonne',
    traffic: 3236378,
    latitude: 43.190387,
    longitude: 3.00591,
  },
  {
    name: 'montauban ville bourbon',
    traffic: 1905125,
    latitude: 44.014387,
    longitude: 1.341496,
  },
  // PARIS, with a piege villeparisis mitry le neuf
  {
    name: 'paris austerlitz',
    traffic: 22602374,
    latitude: 48.842285,
    longitude: 2.364891,
  },
  {
    name: 'paris gare du nord',
    traffic: 256157424,
    latitude: 48.880185,
    longitude: 2.355151,
  },
  {
    name: 'paris montparnasse',
    traffic: 80757023,
    latitude: 48.841172,
    longitude: 2.320514,
  },
  {
    name: 'villeparisis mitry le neuf', // Babaannee Seni Seviyorum <3
    traffic: 4599436,
    latitude: 48.95325,
    longitude: 2.60243,
  },
]

const countJourneys = (departureJourneys: Journey[], type: 'direct' | 'connection') => {
  return departureJourneys.filter(journey =>
    (type === 'direct' && journey.length === 1) || (type === 'connection' && journey.length > 1)).length
}

const expectTrip = (
  trips: Trip[],
  destinationName: string,
  expectedDepartureJourneysDirect: number,
  expectedDepartureJourneysConnection: number = 0,
  expectedReturnJourneysDirect: number = 0,
  expectedReturnJourneysConnection: number = 0,
) => {
  const trip = trips.find(t => t.destinationName === destinationName)
  expect(trip).toBeDefined()

  const departureDirectJourneysCount = countJourneys(trip!.departureJourneys, 'direct')
  const departureConnectionJourneysCount = countJourneys(trip!.departureJourneys, 'connection')

  const returnDirectJourneysCount = countJourneys(trip!.returnJourneys, 'direct')
  const returnConnectionJourneysCount = countJourneys(trip!.returnJourneys, 'connection')

  console.log(`Trip: ${trip?.destinationName},
  Departure Journeys: ${trip?.departureJourneys.length}, direct: ${departureDirectJourneysCount}, connection: ${departureConnectionJourneysCount},
  Return Journeys: ${trip?.returnJourneys.length}, direct: ${returnDirectJourneysCount}, connection: ${returnConnectionJourneysCount}
  `)

  expect(departureDirectJourneysCount).toBe(expectedDepartureJourneysDirect)
  expect(departureConnectionJourneysCount).toBe(expectedDepartureJourneysConnection)
  expect(trip!.departureJourneys).toHaveLength(expectedDepartureJourneysDirect + expectedDepartureJourneysConnection)

  expect(returnDirectJourneysCount).toBe(expectedReturnJourneysDirect)
  expect(returnConnectionJourneysCount).toBe(expectedReturnJourneysConnection)
  expect(trip!.returnJourneys).toHaveLength(expectedReturnJourneysDirect + expectedReturnJourneysConnection)
}

describe('BACKEND - find-trips.use-case.ts', () => {
  let dbContext: PostgresTestManager

  beforeAll(async () => {
    dbContext = new PostgresTestManager()
    await dbContext.start()

    const repository = new TrainsRepositoryPostgres(dbContext.pool)
    await repository.deleteAllEntries()
    await repository.insertManyTrains(trainsMock)

    const trainStationsRepository = new TrainStationsRepositoryPostgres(dbContext.pool)
    await trainStationsRepository.insertManyTrainStations(trainStationsMock)
  })

  afterAll(async () => {
    await dbContext.cleanup()
    await dbContext.close()
  })

  it('Should return direct trips from Toulouse', async () => {
    const trainsRepository = new TrainsRepositoryPostgres(dbContext.pool)
    const trainStationsRepository = new TrainStationsRepositoryPostgres(dbContext.pool)
    const findTripsUseCase = new FindTripsUseCase(trainsRepository, trainStationsRepository)
    const trips = await findTripsUseCase.execute({
      origin: 'Toulouse',
      departureDate: parseISODate('2025-04-15'),
      directOnly: true,
    })

    // We expect 3 destinations: Montauban, Narbonne, and paris
    expect(trips).toHaveLength(3)

    // Montauban: 1 direct journey
    expectTrip(trips, 'MONTAUBAN VILLE BOURBON', 1, 0)

    // Narbonne: 1 direct journey
    expectTrip(trips, 'NARBONNE', 1, 0)

    // Paris: 1 direct journey
    expectTrip(trips, 'PARIS (intramuros)', 1, 0)
  })

  it('Should return direct AND connecting trips from Toulouse', async () => {
    const trainsRepository = new TrainsRepositoryPostgres(dbContext.pool)
    const trainStationsRepository = new TrainStationsRepositoryPostgres(dbContext.pool)
    const findTripsUseCase = new FindTripsUseCase(trainsRepository, trainStationsRepository)
    const trips = await findTripsUseCase.execute({
      origin: 'Toulouse',
      departureDate: parseISODate('2025-04-15'),
      directOnly: false,
    })

    // We expect 3 destinations: Montauban, Narbonne, and paris
    expect(trips).toHaveLength(3)

    // Montauban: 1 direct journey
    expectTrip(trips, 'MONTAUBAN VILLE BOURBON', 1, 0)

    // Narbonne: 1 direct journey
    expectTrip(trips, 'NARBONNE', 1, 0)

    // Paris: 2 journeys (1 direct AND 1 connection)
    expectTrip(trips, 'PARIS (intramuros)', 1, 1)
  })

  it('Should return direct AND connecting trips from Toulouse with a maximum connection time of 2 minutes within the same station.', async () => {
    const trainsRepository = new TrainsRepositoryPostgres(dbContext.pool)
    const trainStationsRepository = new TrainStationsRepositoryPostgres(dbContext.pool)
    const connectionProperties = { minConnectionTimeSameStationMinutes: 2, minConnectionTimeSameCityMinutes: 60, maxConnectionTimeMinutes: 120 }
    const findTripsUseCase = new FindTripsUseCase(trainsRepository, trainStationsRepository, connectionProperties)
    const trips = await findTripsUseCase.execute({
      origin: 'Toulouse',
      departureDate: parseISODate('2025-04-15'),
      directOnly: false,
    })

    // We expect 3 destinations: Montauban, Narbonne, and paris
    expect(trips).toHaveLength(3)

    // Montauban: 1 direct journey
    expectTrip(trips, 'MONTAUBAN VILLE BOURBON', 1, 0)

    // Narbonne: 1 direct journey
    expectTrip(trips, 'NARBONNE', 1, 0)

    // Paris: 3 journeys (1 direct AND 2 connection -> Montauban with 19min AND 10min)
    expectTrip(trips, 'PARIS (intramuros)', 1, 2)
  })

  it ('Should return direct round trips from Toulouse', async () => {
    const trainsRepository = new TrainsRepositoryPostgres(dbContext.pool)
    const trainStationsRepository = new TrainStationsRepositoryPostgres(dbContext.pool)
    const findTripsUseCase = new FindTripsUseCase(trainsRepository, trainStationsRepository)
    const trips = await findTripsUseCase.execute({
      origin: 'Toulouse',
      departureDate: parseISODate('2025-04-15'),
      directOnly: true,
      destination: undefined,
      returnDate: parseISODate('2025-04-29'),
    })

    // We expect 1 destination: Montauban
    expect(trips).toHaveLength(1)

    // Montauban: 1 direct journey
    expectTrip(trips,
      'MONTAUBAN VILLE BOURBON',
      1,
      0,
      1,
    )
  })

  it('Should return direct AND connecting round trips from Toulouse', async () => {
    const trainsRepository = new TrainsRepositoryPostgres(dbContext.pool)
    const trainStationsRepository = new TrainStationsRepositoryPostgres(dbContext.pool)
    const findTripsUseCase = new FindTripsUseCase(trainsRepository, trainStationsRepository)
    const trips = await findTripsUseCase.execute({
      origin: 'Toulouse',
      departureDate: parseISODate('2025-04-15'),
      directOnly: false,
      destination: undefined,
      returnDate: parseISODate('2025-04-29'),
    })

    // We expect 2 destination: Montauban, Paris
    expect(trips).toHaveLength(2)

    expectTrip(trips,
      'MONTAUBAN VILLE BOURBON',
      1,
      0,
      1,
    )

    expectTrip(trips,
      'PARIS (intramuros)',
      1,
      1,
      0,
      1,
    )
  })

  it ('Should return direct trips from Toulouse To Paris', async () => {
    const trainsRepository = new TrainsRepositoryPostgres(dbContext.pool)
    const trainStationsRepository = new TrainStationsRepositoryPostgres(dbContext.pool)
    const findTripsUseCase = new FindTripsUseCase(trainsRepository, trainStationsRepository)
    const trips = await findTripsUseCase.execute({
      origin: 'Toulouse',
      destination: 'Paris',
      departureDate: parseISODate('2025-04-15'),
      directOnly: true,
    })

    // We expect 1 destination: Paris
    expect(trips).toHaveLength(1)

    expectTrip(trips, 'PARIS (intramuros)', 1, 0)
  })

  it ('Should return direct AND connecting round trip from Toulouse To Paris', async () => {
    const trainsRepository = new TrainsRepositoryPostgres(dbContext.pool)
    const trainStationsRepository = new TrainStationsRepositoryPostgres(dbContext.pool)
    const findTripsUseCase = new FindTripsUseCase(trainsRepository, trainStationsRepository)
    const trips = await findTripsUseCase.execute({
      origin: 'Toulouse',
      destination: 'Paris',
      departureDate: parseISODate('2025-04-15'),
      returnDate: parseISODate('2025-04-23'),
      directOnly: false,
    })

    // We expect 1 destination: Paris
    expect(trips).toHaveLength(1)

    expectTrip(
      trips,
      'PARIS (intramuros)',
      1,
      1,
      1,
      1,
    )
  })
})
