import type { Pool } from 'pg'
import type {
  TrainStationsRepository,
  GetTrainStationsFilters,
} from '~/server/domains/train-stations/ports/train-stations.repository'
import type { TrainStation } from '~/server/domains/train-stations/entities/train-station'

export class TrainStationsRepositoryPostgres implements TrainStationsRepository {
  constructor(private readonly pool: Pool) {
    this.pool = pool
  }

  async deleteAllEntries(): Promise<void> {
    await this.pool.query(`DELETE FROM "TrainStation"`)
  }

  async insertTrainStation(trainStation: TrainStation): Promise<void> {
    const { name, traffic, latitude, longitude } = trainStation
    await this.pool.query(
      `INSERT INTO "TrainStation" (name, traffic, latitude, longitude) VALUES ($1, $2, $3, $4)`,
      [name, traffic, latitude, longitude],
    )
  }

  /**
     * Inserts multiple train stations into the PostgreSQL database in a single query.
     * Uses dynamic placeholders to ensure safety (prevent SQL injection) and performance.
     */
  async insertManyTrainStations(trainStations: TrainStation[]): Promise<void> {
    // Exit early if there's nothing to insert
    if (trainStations.length === 0) return

    // This array will hold all values to be inserted
    const values: (string | number)[] = []

    /**
     * Generate a list of value placeholders for PostgreSQL ($1, $2, ..., $n)
     * Each station has 4 fields: name, traffic, latitude, longitude
     */
    const placeholders = trainStations.map((ts, i) => {
      const baseIndex = i * 4 // Offset for current station
      // Push values in the expected order
      values.push(ts.name, ts.traffic, ts.latitude, ts.longitude)
      // Return the corresponding placeholders for this row
      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`
    })

    /**
     * Execute a single INSERT query with all generated placeholders and values
     * Example:
     * INSERT INTO "TrainStation" (name, traffic, latitude, longitude)
     * VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ...
     */
    await this.pool.query(
      `INSERT INTO "TrainStation" (name, traffic, latitude, longitude) VALUES ${placeholders.join(', ')}`,
      values,
    )
  }

  async getTrainStations(filters: GetTrainStationsFilters): Promise<TrainStation[]> {
    const conditions: string[] = []
    const values: (string | number)[] = []

    if (filters.name) {
      values.push(`%${filters.name}%`)
      conditions.push(`name ILIKE $${values.length}`)
    }

    let SQL = `SELECT name, traffic, latitude, longitude FROM "TrainStation"`

    if (conditions.length > 0) {
      SQL += ' WHERE ' + conditions.join(' AND ')
    }

    // Add LIMIT if provided
    if (filters.limit) {
      values.push(filters.limit)
      SQL += ` LIMIT $${values.length}`
    }

    // Execute query and return result
    const result = await this.pool.query(SQL, values)
    return result.rows as TrainStation[]
  }
}
