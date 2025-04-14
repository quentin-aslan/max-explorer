import { Pool } from 'pg'

const config = useRuntimeConfig()

let pool: Pool | null = null

export const getPgPool = (): Pool => {
  if (!pool) {
    pool = new Pool({
      connectionString: config.DATABASE_URL || 'postgresql://max-explorer:max-explorer@localhost:5432/max-explorer',
    })
  }
  return pool
}
