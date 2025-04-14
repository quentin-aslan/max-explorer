import type { Database } from 'better-sqlite3'
import type {
  GetTrainStationsFilters,
  TrainStationsRepository,
} from '~/server/domains/train-stations/ports/train-stations.repository'
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

  public getTrainStations(filters: GetTrainStationsFilters): TrainStation[] {
    let SQL = `SELECT * FROM main.TrainStation`
    const params = []

    if (filters.name) {
      SQL += ` WHERE name LIKE ?`
      params.push(`%${filters.name}%`)
    }

    if (filters.limit) {
      SQL += ` LIMIT ?`
      params.push(filters.limit)
    }

    const rows = this.sqlite.prepare(SQL).all(...params) as TrainStation[]
    return rows.map((row: any) => ({
      name: row.name,
      traffic: row.traffic,
      latitude: row.latitude,
      longitude: row.longitude,
    }))
  }
}
