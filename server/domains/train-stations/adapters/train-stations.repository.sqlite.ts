import type { Database } from 'better-sqlite3'
import type { TrainStationsRepository } from '~/server/domains/train-stations/ports/train-stations.repository'
import type { TrainStation } from '~/server/domains/train-stations/entities/train-station'

export class TrainStationsRepositorySqlite implements TrainStationsRepository {
  constructor(private readonly sqlite: Database) {
    this.sqlite = sqlite
  }

  public deleteAllEntries() {
    this.sqlite.prepare(`DELETE FROM main.TrainStation`)
  }

  public insertTrainStation(trainStation: TrainStation) {
    this.sqlite.prepare(`INSERT INTO main.TrainStation (name, traffic, latitude, longitude) VALUES (?, ?, ?, ?)`)
      .run(trainStation.name, trainStation.traffic, trainStation.latitude, trainStation.longitude)
  }

  public insertManyTrainStations(trainStations: TrainStation[]) {
    const insert = this.sqlite.prepare(`INSERT INTO main.TrainStation (name, traffic, latitude, longitude) VALUES (?, ?, ?, ?)`)
    for (const trainStation of trainStations) {
      insert.run(trainStation.name, trainStation.traffic, trainStation.latitude, trainStation.longitude)
    }
  }
}
