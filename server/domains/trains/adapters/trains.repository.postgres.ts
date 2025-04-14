import type { Pool } from 'pg'
import type { Train } from '~/server/domains/trains/entities/train'
import type { GetTrainsFilters, TrainsRepository } from '~/server/domains/trains/ports/trains.repository'
import type { TrainPostgres } from '~/server/domains/trains/entities/TrainPostgres'
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

  // Public method to insert a large number of Train objects into the database
  // Automatically splits into batches to avoid PostgreSQL's parameter limit
  public async insertManyTrains(trains: Train[]): Promise<void> {
    const FIELDS_PER_TRAIN = 11
    const MAX_PARAMS = 65500 // PostgreSQL has a hard limit of 65535 parameters per query
    const MAX_TRAINS_PER_BATCH = Math.floor(MAX_PARAMS / FIELDS_PER_TRAIN)

    // Insert trains in batches to avoid exceeding the parameter limit
    for (let i = 0; i < trains.length; i += MAX_TRAINS_PER_BATCH) {
      const batch = trains.slice(i, i + MAX_TRAINS_PER_BATCH)
      await this.insertManyTrainsBatch(batch)
    }
  }

  // Helper method that inserts a batch of Train objects
  // Assumes batch size is small enough to stay under PostgreSQL's parameter limit
  private async insertManyTrainsBatch(trains: Train[]): Promise<void> {
    if (trains.length === 0) return

    const values: (string | null | number)[] = [] // All values to be bound to the SQL placeholders
    const placeholders: string[] = [] // SQL placeholders like ($1, $2, ..., $11), one per train

    // Prepare the values and placeholder strings
    for (const [i, train] of trains.entries()) {
      const baseIndex = i * 11
      const t = this.trainToTrainPostgres(train)

      values.push(
        t.date,
        t.trainNo,
        t.entity,
        t.axe,
        t.originIata,
        t.destinationIata,
        t.origin,
        t.destination,
        t.departureDateTime,
        t.arrivalDateTime,
        t.isEligibleForMaxSubscription ? 1 : 0,
      )

      // Generate a string like ($1, $2, ..., $11) for this train
      placeholders.push(
        `(${Array.from({ length: 11 }, (_, j) => `$${baseIndex + j + 1}`).join(', ')})`,
      )
    }

    // Final SQL insert query with all placeholders
    const query = `
    INSERT INTO "Train" (
      "date", "trainNo", "entity", "axe", "originIata", "destinationIata", 
      "origin", "destination", "departureDateTime", "arrivalDateTime", 
      "isEligibleForMaxSubscription"
    ) VALUES ${placeholders.join(', ')}
  `

    // Execute the query with all the values
    await this.pool.query(query, values)
    console.log(`Inserted ${trains.length} trains in batch`)
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

  private trainToTrainPostgres(train: Train): TrainPostgres {
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
