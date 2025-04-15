import type { ToastServiceMethods } from 'primevue/toastservice'
import type { TripsPresenter } from '~/domains/trips/ports/trips.presenter'
import type { Trip } from '~/domains/trips/entities/trip'
import type { Train } from '~/domains/trips/entities/train'
import type { TripViewModel } from '~/domains/trips/entities/trip.view-model'
import type { TrainViewModel } from '~/domains/trips/entities/train.view-model'

// TODO: IMPLEMENTER JourneyViewModel

export class TripsPresenterImpl implements TripsPresenter {
  constructor(
    private readonly tripsViewModel: (viewModel: TripViewModel[]) => void,
    private readonly toastComposable: ToastServiceMethods,
  ) {}

  public present(trip: Trip[]): void {
    this.tripsViewModel(trip.map(t => ({
      ...t,
      departureJourneys: t.departureJourneys.map(_t => _t.map(this.trainToTrainViewModel)),
      returnJourneys: t.returnJourneys.map(_t => _t.map(this.trainToTrainViewModel)),
    })))
  }

  public presentError(error: string) {
    // A voir si je retourne juste pas une phrase justement, ce qui me permetterais donc de gerer le toast dans le component, ce qui serait encore plus framework agnostic
    this.toastComposable.add({
      severity: 'error',
      summary: error ?? 'An error ocurred while fetching destinations',
      life: 5000,
    })
  }

  private trainToTrainViewModel(train: Train): TrainViewModel {
    return {
      ...train,
      nightTrain: Boolean(train.axe === 'IC NUIT'),

    }
  }
}
