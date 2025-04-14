import type { TrainStationsRepository } from '~/server/domains/train-stations/ports/train-stations.repository'
import type { TrainStation } from '~/server/domains/train-stations/entities/train-station'
import type { TrainStationsSncfRepository } from '~/server/domains/train-stations/ports/train-stations-sncf.repository'

export class ImportTrainStationsUseCase {
  constructor(
    private readonly trainStationsSncfRepository: TrainStationsSncfRepository,
    private readonly trainStationsRepository: TrainStationsRepository,
  ) {}

  public async execute() {
    const trainStationFromSncf = await this.trainStationsSncfRepository.fetchTrainStations()
    const trainStationFromSncfWithTraffic = await this.trainStationsSncfRepository.fetchTrainStationsTraffic()

    let trainStations: TrainStation[] = []

    // Merge train stations with traffic
    for (const trainStationFromAPI of trainStationFromSncf) {
      const traffic = trainStationFromSncfWithTraffic.find(t => t.name === trainStationFromAPI.name)
        ?.traffic ?? 0

      if (traffic === 0) {
        console.log(`No traffic found for ${trainStationFromAPI.name}`)
      }

      trainStations.push({ ...trainStationFromAPI, traffic })
    }

    // Clear the database
    await this.trainStationsRepository.deleteAllEntries()

    // Sort the train by traffic
    trainStations = trainStations.sort((a, b) => b.traffic - a.traffic)

    // Then insert the train stations in the database
    const batchSize = 1000
    for (let i = 0; i < trainStations.length; i += batchSize) {
      const batch = trainStations.slice(i, i + batchSize)
      await this.trainStationsRepository.insertManyTrainStations(batch)
      console.log(`Inserted ${i + batch.length} trainStations.`)
    }

    console.log(`${trainStations.length} train stations imported with success`)
    return `${trainStations.length} train stations imported with success`
  }
}
