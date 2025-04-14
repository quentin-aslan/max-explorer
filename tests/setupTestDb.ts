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

import fs from 'fs'
import path from 'path'
import Database, { type Database as DatabaseType } from 'better-sqlite3'
import getUmzug from '~/scripts/umzug'

export class SqliteTestManager {
  public db: DatabaseType
  private fileName: string

  constructor(fileName: string = 'sqlite_test.db') {
    this.fileName = fileName
    this.db = new Database(fileName)
  }

  public async start(): Promise<void> {
    const umzug = getUmzug(this.fileName)

    // Reset and re-run all migrations
    await umzug.down({ to: 0 }).catch(() => {})
    await umzug.up()
  }

  public close(): void {
    this.db.close()
  }

  public cleanup(): void {
    try {
      fs.rmSync(path.resolve(this.fileName), { force: true, recursive: true })
    }
    catch (err) {
      console.error(`Failed to remove test DB file: ${err}`)
    }
  }
}
