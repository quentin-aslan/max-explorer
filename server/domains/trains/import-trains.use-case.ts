import type { TrainsRepository } from '~/server/domains/trains/ports/trains.repository'
import type { TrainsSncfRepository } from '~/server/domains/trains/ports/trains-sncf.repository'

export class ImportTrainsUseCase {
  constructor(
    private readonly trainsSncfRepository: TrainsSncfRepository,
    private readonly trainsRepository: TrainsRepository,
  ) {}

  async execute(): Promise<string> {
    const trainsFromSncf = await this.trainsSncfRepository.getTrains()
    this.trainsRepository.deleteAllEntries()

    const batchSize = 1000
    for (let i = 0; i < trainsFromSncf.length; i += batchSize) {
      const batch = trainsFromSncf.slice(i, i + batchSize)
      this.trainsRepository.insertManyTrains(batch)
    }

    console.log(`${trainsFromSncf.length} trains imported with success`)
    return `${trainsFromSncf.length} trains imported with success`
  }
}
