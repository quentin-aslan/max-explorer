import { describe, expect, it } from 'vitest'
import { DateTime } from 'luxon'
import { FindTripsUseCase } from '~/domains/trips/find-trips.use-case'
import { TripsRepositoryMock } from '~/domains/trips/adapters/trips.repository.mock'
import { TripsPresenterImpl } from '~/domains/trips/adapters/trips.presenter.impl'
import type { TripViewModel } from '~/domains/trips/entities/view-models/trip.view-model'
import type { Trip } from '~/domains/trips/entities/trip'

const tripsMock: Trip[] = [
  {
    destinationName: 'TOULOUSE MATABIAU',
    trainStation: { name: 'Paris', longitude: 1, latitude: 1, traffic: 75000 },
    departureJourneys: [
      // Paris -> Montauban -> Toulouse (connection: 17min, total: 4h38)
      [
        {
          date: DateTime.fromISO('2025-04-23T00:00:00.000Z'),
          trainNo: '0006',
          entity: 'PASUDOUEST',
          axe: 'ATLANTIQUE',
          originIata: 'FRPMO',
          destinationIata: 'FRXMW',
          origin: 'PARIS (intramuros)',
          destination: 'MONTAUBAN VILLE BOURBON',
          departureDateTime: DateTime.fromISO('2025-04-23T10:00:00.000Z'),
          arrivalDateTime: DateTime.fromISO('2025-04-23T11:00:00.000Z'),
        },
        {
          date: DateTime.fromISO('2025-04-23T00:00:00.000Z'),
          trainNo: '0007',
          entity: 'PASUDOUEST',
          axe: 'ATLANTIQUE',
          originIata: 'FRXMW',
          destinationIata: 'FRXYT',
          origin: 'MONTAUBAN VILLE BOURBON',
          destination: 'TOULOUSE MATABIAU',
          departureDateTime: DateTime.fromISO('2025-04-23T11:17:00.000Z'),
          arrivalDateTime: DateTime.fromISO('2025-04-23T14:38:00.000Z'),
        },
      ],
    ],
    returnJourneys: [
      [{
        date: DateTime.fromISO('2025-04-25T00:00:00.000Z'),
        trainNo: '0004',
        entity: 'SUDOUESTPA',
        axe: 'ATLANTIQUE',
        originIata: 'FRXYT',
        destinationIata: 'FRPMO',
        origin: 'TOULOUSE MATABIAU',
        destination: 'PARIS (intramuros)',
        departureDateTime: DateTime.fromISO('2025-04-25T04:00:00.000Z'),
        arrivalDateTime: DateTime.fromISO('2025-04-25T04:38:00.000Z'),
      }],
    ],
  },
]

describe('find-trips.use-case.ts', () => {
  it('Should connection and total duration time well calculated by the presenter', async () => {
    let trips: TripViewModel[] = []
    let error: string | undefined = undefined
    const findTripsUseCase = new FindTripsUseCase(
      new TripsRepositoryMock(tripsMock),
      new TripsPresenterImpl(vm => trips = vm, errorVm => error = errorVm),
    )

    await findTripsUseCase.execute({
      origin: 'origin-mock',
      departureDate: DateTime.now(),
      directOnly: true,
    })

    expect(error).toBeUndefined()
    expect(trips).toHaveLength(1)
    expect(trips[0].departureJourneys).toHaveLength(1)
    expect(trips[0].departureJourneys[0].trains).toHaveLength(2)

    expect(trips[0].departureJourneys[0].connectionDurationMinutes).toBe(17)
    expect(trips[0].departureJourneys[0].journeyTotalDurationMinutes).toBe(278) // 4h38

    expect(trips[0].returnJourneys).toHaveLength(1)
    expect(trips[0].returnJourneys[0].trains).toHaveLength(1)
    expect(trips[0].returnJourneys[0].connectionDurationMinutes).toBe(0)
    expect(trips[0].returnJourneys[0].journeyTotalDurationMinutes).toBe(38)
  })

  it('Should present an error', async () => {
    let trips: TripViewModel[] | undefined = undefined
    let error: string | undefined = undefined
    const findTripsUseCase = new FindTripsUseCase(
      new TripsRepositoryMock('error'),
      new TripsPresenterImpl(vm => trips = vm, errorVm => error = errorVm),
    )

    await findTripsUseCase.execute({
      origin: 'origin-mock',
      departureDate: DateTime.now(),
      directOnly: true,
    })

    expect(trips).toBeUndefined()
    expect(error).toBe('An error ocurred while fetching destinations')
  })
})
