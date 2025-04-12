import Database from 'better-sqlite3'

const config = useRuntimeConfig()
export const sqliteDb = new Database(config.DATABASE_URL || 'sqlite.db')
