import type { FindTripsParameters, TripsRepository } from '~/domains/trips/ports/trips.repository'
import type { TripsPresenter } from '~/domains/trips/ports/trips.presenter'

export class FindTripsUseCase {
  constructor(
    private readonly tripsRepository: TripsRepository,
    private readonly tripsPresenter: TripsPresenter,
  ) {}

  public async execute(params: FindTripsParameters) {
    try {
      const trips = await this.tripsRepository.findTrips(params)
      this.tripsPresenter.present(trips)
    }
    catch (e: any) {
      console.error(e)
      this.tripsPresenter.presentError('An error ocurred while fetching destinations')
    }
  }
}
