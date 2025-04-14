import type { Pool } from 'pg'
import type { Train } from '~/server/domains/trains/entities/train'
import type { GetTrainsFilters, TrainsRepository } from '~/server/domains/trains/ports/trains.repository'
import type { TrainSqlite } from '~/server/domains/trains/entities/TrainSqlite'
import { parseISODate } from '~/server/utils/dateUtils'

export class TrainsRepositoryPostgres implements TrainsRepository {
  constructor(private readonly pool: Pool) {
    this.pool = pool
  }

  // Deletes all entries from the Train table
  public async deleteAllEntries(): Promise<void> {
    await this.pool.query(`DELETE FROM "Train"`)
  }

  // Inserts a single train into the database
  public async insertTrain(train: Train): Promise<void> {
    const trainPostgres = this.trainToTrainPostgres(train)
    await this.pool.query(`
      INSERT INTO "Train" (
        "date",
        "trainNo",
        "entity",
        "axe",
        "originIata",
        "destinationIata",
        "origin",
        "destination",
        "departureDateTime",
        "arrivalDateTime",
        "isEligibleForMaxSubscription"
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      trainPostgres.date,
      trainPostgres.trainNo,
      trainPostgres.entity,
      trainPostgres.axe,
      trainPostgres.originIata,
      trainPostgres.destinationIata,
      trainPostgres.origin,
      trainPostgres.destination,
      trainPostgres.departureDateTime,
      trainPostgres.arrivalDateTime,
      trainPostgres.isEligibleForMaxSubscription ? 1 : 0,
    ])
  }

  // Inserts multiple trains into the database
  public async insertManyTrains(trains: Train[]): Promise<void> {
    if (trains.length === 0) return

    const values: (string | null | number)[] = []
    const placeholders: string[] = []

    // Preparing placeholders and values for bulk insert using for...of loop
    for (const [i, train] of trains.entries()) {
      const baseIndex = i * 11 // 11 fields per train
      const trainPostgres = this.trainToTrainPostgres(train)

      values.push(
        trainPostgres.date,
        trainPostgres.trainNo,
        trainPostgres.entity,
        trainPostgres.axe,
        trainPostgres.originIata,
        trainPostgres.destinationIata,
        trainPostgres.origin,
        trainPostgres.destination,
        trainPostgres.departureDateTime,
        trainPostgres.arrivalDateTime,
        trainPostgres.isEligibleForMaxSubscription ? 1 : 0,
      )
      placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9}, $${baseIndex + 10}, $${baseIndex + 11})`)
    }

    const query = `
      INSERT INTO "Train" (
        "date", "trainNo", "entity", "axe", "originIata", "destinationIata", "origin", "destination", 
        "departureDateTime", "arrivalDateTime", "isEligibleForMaxSubscription"
      ) 
      VALUES ${placeholders.join(', ')}
    `

    await this.pool.query(query, values)
    console.log(`Inserted ${trains.length} trains`)
  }

  // Retrieves trains based on filters
  public async getTrains(filters: GetTrainsFilters): Promise<Train[]> {
    const { origin, departureDate, destination, excludeDestination } = filters
    const conditions: string[] = []
    const values: string[] = []

    if (origin) {
      values.push(`%${origin}%`)
      conditions.push(`origin ILIKE $${values.length}`)
    }

    if (departureDate) {
      const formattedDate = departureDate.toFormat('yyyy-MM-dd')
      values.push(formattedDate)
      conditions.push(`DATE("departureDateTime") = $${values.length}`)
    }

    if (destination) {
      values.push(`%${destination}%`)
      conditions.push(`destination ILIKE $${values.length}`)
    }

    if (excludeDestination) {
      values.push(`%${excludeDestination}%`)
      conditions.push(`destination NOT ILIKE $${values.length}`)
    }

    let sql = `SELECT * FROM "Train"`
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    const result = await this.pool.query(sql, values)

    return result.rows.map((row: any) => ({
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

  private trainToTrainPostgres(train: Train): TrainSqlite {
    return {
      date: train.date.setZone('Europe/Paris').toISO() as string,
      trainNo: train.trainNo,
      entity: train.entity,
      axe: train.axe,
      originIata: train.originIata,
      destinationIata: train.destinationIata,
      origin: train.origin,
      destination: train.destination,
      departureDateTime: train.departureDateTime.setZone('Europe/Paris').toISO() as string,
      arrivalDateTime: train.arrivalDateTime.setZone('Europe/Paris').toISO() as string,
      isEligibleForMaxSubscription: train.isEligibleForMaxSubscription,
    }
  }
}
