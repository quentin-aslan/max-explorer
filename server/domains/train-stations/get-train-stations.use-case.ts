import type { TrainStationsRepository } from '~/server/domains/train-stations/ports/train-stations.repository'

export default class GetTrainStationsUseCase {
  constructor(
    private readonly trainStationRepository: TrainStationsRepository,
  ) {}

  public async execute() {
    try {
      return await this.trainStationRepository.getTrainStations({})
    }
    catch (e) {
      console.error(e)
      return []
    }
  }
}
