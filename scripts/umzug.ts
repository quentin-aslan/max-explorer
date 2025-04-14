import 'dotenv/config'
import * as fs from 'node:fs'
import { Umzug, type UmzugStorage } from 'umzug'
import type { PoolConfig } from 'pg'
import pg from 'pg'

const { Pool } = pg

const getUmzug = (dbConfig?: PoolConfig, storage?: UmzugStorage) => {
  const pool = new Pool(dbConfig)

  console.log(`Using PostgreSQL at: ${dbConfig?.connectionString}`)

  return new Umzug({
    migrations: {
      glob: 'migrations/*.up.sql',
      resolve: ({ name, path, context: pool }) => {
        if (!path) {
          throw new Error(`Migration file path is undefined for migration: ${name}`)
        }

        return {
          name,
          up: async () => {
            const sql = fs.readFileSync(path, 'utf8')
            try {
              await pool.query(sql)
            }
            catch (error) {
              console.error(`Error running migration ${name}:`, error)
              throw error // Rethrow the error to indicate failure
            }
          },
          down: async () => {
            const sql = fs.readFileSync(path.replace('.up.sql', '.down.sql'), 'utf8')
            try {
              await pool.query(sql)
            }
            catch (error) {
              console.error(`Error rolling back migration ${name}:`, error)
              throw error // Rethrow the error to indicate failure
            }
          },
        }
      },
    },
    context: pool,
    logger: console,
    storage,
  })
}

export default getUmzug
