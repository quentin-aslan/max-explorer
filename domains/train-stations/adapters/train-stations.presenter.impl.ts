import type { TrainStationsPresenter } from '~/domains/train-stations/ports/train-stations.presenter'
import type { TrainStation } from '~/domains/train-stations/entities/train-station'

// In this case the presenter does not do anything, but it is a good practice to have it
export class TrainStationsPresenterImpl implements TrainStationsPresenter {
  constructor(
    private readonly trainStationsViewModel: (viewModel: TrainStation[]) => void,
  ) {}

  present(trainStations: TrainStation[]) {
    const formattedTrainStations: TrainStation[] = trainStations.map(t => ({
      name: `${t.name[0].toUpperCase()}${t.name.slice(1).toLowerCase()}`,
      traffic: t.traffic,
      latitude: t.latitude,
      longitude: t.longitude,
    }))

    this.trainStationsViewModel(formattedTrainStations)
  }
}
