import type { Database } from 'better-sqlite3'
import type { Train } from '~/server/domains/trains/entities/train'
import type { TrainsRepository } from '~/server/domains/trains/ports/trains.repository'
import type { TrainSqlite } from '~/server/domains/trains/entities/TrainSqlite'

export class TrainsRepositorySqlite implements TrainsRepository {
  constructor(private readonly sqlite: Database) {
    this.sqlite = sqlite
  }

  public deleteAllEntries() {
    this.sqlite.prepare(`DELETE FROM main.Train`)
  }

  public insertTrain(train: Train) {
    const trainSqlite = this.trainToTrainSqlite(train)
    this.sqlite.prepare(`
    INSERT INTO main.Train (
      date,
      trainNo,
      entity,
      axe,
      originIata,
      destinationIata,
      origin,
      destination,
      departureDateTime,
      arrivalDateTime,
      isEligibleForMaxSubscription
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
      trainSqlite.date,
      trainSqlite.trainNo,
      trainSqlite.entity,
      trainSqlite.axe,
      trainSqlite.originIata,
      trainSqlite.destinationIata,
      trainSqlite.origin,
      trainSqlite.destination,
      trainSqlite.departureDateTime,
      trainSqlite.arrivalDateTime,
      trainSqlite.isEligibleForMaxSubscription ? 1 : 0,
    )
  }

  public insertManyTrains(trains: Train[]) {
    const insert = this.sqlite.prepare(`
    INSERT INTO main.Train (
      date,
      trainNo,
      entity,
      axe,
      originIata,
      destinationIata,
      origin,
      destination,
      departureDateTime,
      arrivalDateTime,
      isEligibleForMaxSubscription
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    for (const train of trains) {
      const trainSqlite = this.trainToTrainSqlite(train)

      insert.run(
        trainSqlite.date,
        trainSqlite.trainNo,
        trainSqlite.entity,
        trainSqlite.axe,
        trainSqlite.originIata,
        trainSqlite.destinationIata,
        trainSqlite.origin,
        trainSqlite.destination,
        trainSqlite.departureDateTime,
        trainSqlite.arrivalDateTime,
        trainSqlite.isEligibleForMaxSubscription ? 1 : 0,
      )
    }
  }

  private trainToTrainSqlite(train: Train): TrainSqlite {
    return {
      date: train.date.toISOString(),
      trainNo: train.trainNo,
      entity: train.entity,
      axe: train.axe,
      originIata: train.originIata,
      destinationIata: train.destinationIata,
      origin: train.origin,
      destination: train.destination,
      departureDateTime: train.departureDateTime.toISOString(),
      arrivalDateTime: train.arrivalDateTime.toISOString(),
      isEligibleForMaxSubscription: train.isEligibleForMaxSubscription,
    }
  }
}
