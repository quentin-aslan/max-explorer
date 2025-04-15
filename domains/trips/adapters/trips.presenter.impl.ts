import type { TripsPresenter } from '~/domains/trips/ports/trips.presenter'
import type { Trip } from '~/domains/trips/entities/trip'
import type { Train } from '~/domains/trips/entities/train'
import type { TripViewModel } from '~/domains/trips/entities/view-models/trip.view-model'
import type { TrainViewModel } from '~/domains/trips/entities/view-models/train.view-model'
import type { JourneyViewModel } from '~/domains/trips/entities/view-models/journey.view-model'

export class TripsPresenterImpl implements TripsPresenter {
  constructor(
    private readonly tripsViewModel: (viewModel: TripViewModel[]) => void,
    private readonly tripsErrorViewModel: (error: string) => void,
  ) {}

  public present(trip: Trip[]): void {
    this.tripsViewModel(trip.map(t => ({
      ...t,
      departureJourneys: t.departureJourneys.map(j => this.journeyToJourneyViewModel(j)),
      returnJourneys: t.returnJourneys.map(j => this.journeyToJourneyViewModel(j)),
    })))
  }

  public presentError(errorMsg: string) {
    this.tripsErrorViewModel(errorMsg)
  }

  private journeyToJourneyViewModel(journey: Train[]): JourneyViewModel {
    // Only one connection is supported.
    const firstDepartureTime = journey[0].departureDateTime
    const firstArrivalTime = journey[0].arrivalDateTime
    const lastDepartureTime = journey?.[1]?.departureDateTime
    const lastArrivalTime = journey?.[1]?.arrivalDateTime

    const connectionDurationMinutes = (lastArrivalTime) ? Math.round(lastDepartureTime.diff(firstArrivalTime, 'minutes').minutes) : 0
    const journeyTotalDurationMinutes = (lastArrivalTime)
      ? Math.round(lastArrivalTime.diff(firstDepartureTime, 'minutes').minutes)
      : Math.round(firstArrivalTime.diff(firstDepartureTime, 'minutes').minutes)

    return {
      connectionDurationMinutes,
      journeyTotalDurationMinutes,
      trains: journey.map(t => this.trainToTrainViewModel(t)),
    }
  }

  private trainToTrainViewModel(train: Train): TrainViewModel {
    return {
      ...train,
      nightTrain: Boolean(train.axe === 'IC NUIT'),
    }
  }
}
