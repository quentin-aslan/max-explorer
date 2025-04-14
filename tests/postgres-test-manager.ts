/**
 * PostgresTestManager - Utility class for managing a temporary PostgreSQL test environment.
 *
 * This class is designed to assist with automated testing by:
 * - Initializing a PostgreSQL connection pool
 * - Running all database migrations using Umzug (down → up) to ensure a clean state
 * - Providing methods to reset or teardown the test database environment
 *
 * Usage:
 * - Instantiate the class before tests
 * - Call `start()` to prepare the DB
 * - Optionally call `cleanup()` between tests
 * - Call `close()` when tests are done to release the connection
 *
 * Note: Intended for local development or CI environments.
 *
 * Author: Quentin Aslan <quentin.aslan@outlook.com>
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
    console.log('PostgresTestManager: Creating a new PostgresTestManager instance')
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
