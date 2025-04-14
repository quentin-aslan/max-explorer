import pg from 'pg'
import type { Pool as PoolType } from 'pg'

const { Pool } = pg

const config = useRuntimeConfig()

let pool: PoolType | null = null

export const getPgPool = (): PoolType => {
  if (!pool) {
    pool = new Pool({
      connectionString: config.DATABASE_URL || 'postgresql://max-explorer:max-explorer@localhost:5432/max-explorer',
    })
  }
  return pool
}
