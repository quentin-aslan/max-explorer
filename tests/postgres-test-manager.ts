/**
 * Utility class for managing a temporary SQLite test database.
 *
 * This class:
 * - Creates a SQLite database file (or in-memory if desired)
 * - Runs all migrations (down → up) using Umzug
 * - Provides methods to close the DB and clean up the file
 *
 * Intended for use in automated test environments.
 * Quentin Aslan <quentin.aslan@outlook.com>
 */

import type { Pool as PoolType, PoolConfig } from 'pg'
import pg from 'pg'
import getUmzug from '~/scripts/umzug'

const { Pool } = pg

export class PostgresTestManager {
  public pool: PoolType
  private dbConfig: PoolConfig = {
    connectionString: 'postgresql://max-explorer:max-explorer@localhost:5432/postgres',
  }

  constructor(dbConfig?: PoolConfig) {
    this.pool = new Pool(dbConfig ?? this.dbConfig)
  }

  public async start(): Promise<void> {
    const umzug = getUmzug(this.dbConfig)

    // Reset and re-run all migrations
    await umzug.down({ to: 0 }).catch(() => {})
    await umzug.up()
  }

  public async close() {
    await this.pool.end()
  }

  public async cleanup() {
    const umzug = getUmzug(this.dbConfig)
    await umzug.down({ to: 0 }).catch(() => {})
  }
}
