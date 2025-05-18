import type { TrainStationsRepository } from '~/server/domains/train-stations/ports/train-stations.repository'
import type { TrainStation } from '~/server/domains/train-stations/entities/train-station'
import type { TrainStationsSncfRepository } from '~/server/domains/train-stations/ports/train-stations-sncf.repository'
import type { TrainsRepository } from '~/server/domains/trains/ports/trains.repository'

export class ImportTrainStationsUseCase {
  constructor(
    private readonly trainStationsSncfRepository: TrainStationsSncfRepository,
    private readonly trainStationsRepository: TrainStationsRepository,
    private readonly trainsRepository: TrainsRepository,
  ) {}

  public async execute() {
    const trainsList = await this.trainsRepository.getTrains({})
    console.log(`trainsList length: ${trainsList.length}`)

    const uniqueTrainStationList = new Map<string, TrainStation>()
    for (const train of trainsList) {
      uniqueTrainStationList.set(train.origin, {
        name: train.origin,
        traffic: 0,
        longitude: 0,
        latitude: 0,
      })

      uniqueTrainStationList.set(train.destination, {
        name: train.destination,
        traffic: 0,
        longitude: 0,
        latitude: 0,
      })
    }

    console.log(`uniqueTrainStationList length: ${uniqueTrainStationList.size}`)

    const trainStationFromSNCF_WithCoordinates = await this.trainStationsSncfRepository.fetchTrainStations()
    const trainStationFromSNCF_WithTraffic = await this.trainStationsSncfRepository.fetchTrainStationsTraffic()

    for (const trainStationFromMax of uniqueTrainStationList) {
      const trainStationName = trainStationFromMax[0].toLowerCase()
      const regex = new RegExp(trainStationName.replace(/\s+/g, '\\s+'), 'i') // Créer un regex insensible à la casse et avec espace flexible

      const trainStationWithCoordinates = trainStationFromSNCF_WithCoordinates.find(t => regex.test(t.name.toLowerCase()))
      const traffic = trainStationFromSNCF_WithTraffic.find(t => regex.test(t.name.toLowerCase()))?.traffic ?? 0

      if (trainStationWithCoordinates) {
        uniqueTrainStationList.set(trainStationFromMax[0], {
          name: trainStationFromMax[0],
          traffic,
          longitude: trainStationWithCoordinates.longitude,
          latitude: trainStationWithCoordinates.latitude,
        })
      }
    }

    const trainStationToInsert: TrainStation[] = []
    const trainStationAlreadyInDb = await this.trainStationsRepository.getTrainStations({})
    for (const trainStation of uniqueTrainStationList.values()) {
      if (!trainStationAlreadyInDb.find(ts => ts.name === trainStation.name)) {
        console.log(`trainStation ${trainStation.name} not found in db, inserting it...`)
        trainStationToInsert.push(trainStation)
      }
    }

    await this.trainStationsRepository.insertManyTrainStations(trainStationToInsert)

    return `${trainStationToInsert.length} train stations imported with success`
  }
}
