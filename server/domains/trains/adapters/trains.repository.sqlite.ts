import type { Database } from 'better-sqlite3'
import type { Train } from '~/server/domains/trains/entities/train'
import type { GetTrainsFilters, TrainsRepository } from '~/server/domains/trains/ports/trains.repository'
import type { TrainSqlite } from '~/server/domains/trains/entities/TrainSqlite'
import { parseISODate } from '~/server/utils/dateUtils'

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
    // On prépare l'insertion une seule fois
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

    const insertMany = this.sqlite.transaction((trainsBatch: Train[]) => {
      for (const train of trainsBatch) {
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
    })
    insertMany(trains)

    console.log(`Inserted ${trains.length} trains`)
  }

  public getTrains(filters: GetTrainsFilters): Train[] {
    const { origin, departureDate, destination, excludeDestination } = filters

    const formattedDate = departureDate.toFormat('yyyy-MM-dd')

    // Build the SQL query dynamically based on the filters
    let sql = `
    SELECT * FROM Train
    WHERE origin LIKE ?
    AND DATE(departureDateTime) = ?

    `
    const params: string[] = [`%${origin}%`, formattedDate]

    if (destination) {
      sql += ' AND destination LIKE ?'
      params.push(`%${destination}%`)
    }

    if (excludeDestination) {
      sql += ' AND destination NOT LIKE ?'
      params.push(`%${excludeDestination}%`)
    }

    const rows = this.sqlite.prepare(sql).all(...params)

    // Convert the rows to Train objects
    return rows.map((row: any): Train => ({
      date: parseISODate(row.date),
      trainNo: row.trainNo,
      entity: row.entity,
      axe: row.axe,
      originIata: row.originIata,
      destinationIata: row.destinationIata,
      origin: row.origin,
      destination: row.destination,
      departureDateTime: parseISODate(row.departureDateTime),
      arrivalDateTime: parseISODate(row.arrivalDateTime),
      isEligibleForMaxSubscription: !!row.isEligibleForMaxSubscription,
    }))
  }

  private trainToTrainSqlite(train: Train): TrainSqlite {
    return {
      date: train.date.toISO() as string,
      trainNo: train.trainNo,
      entity: train.entity,
      axe: train.axe,
      originIata: train.originIata,
      destinationIata: train.destinationIata,
      origin: train.origin,
      destination: train.destination,
      departureDateTime: train.departureDateTime.toISO() as string,
      arrivalDateTime: train.arrivalDateTime.toISO() as string,
      isEligibleForMaxSubscription: train.isEligibleForMaxSubscription,
    }
  }
}
