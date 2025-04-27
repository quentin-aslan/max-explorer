import type { TrainStationsRepository } from '~/domains/train-stations/ports/train-stations.repository'
import type { TrainStationsPresenter } from '~/domains/train-stations/ports/train-stations.presenter'

export class GetTrainStationsUseCase {
  constructor(private trainStationsRepository: TrainStationsRepository) {}

  async execute(presenter: TrainStationsPresenter) {
    const trainStations = await this.trainStationsRepository.fetchTrainStations()
    presenter.present(trainStations)
  }
}
