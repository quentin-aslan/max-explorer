import 'dotenv/config'
import * as fs from 'node:fs'
import { Umzug } from 'umzug'
import Database from 'better-sqlite3'

const DATABASE_PATH = process.env.DATABASE_URL || 'sqlite.db'
console.log(`Using database path: ${DATABASE_PATH}`)

const db = new Database(DATABASE_PATH)

export default new Umzug({
  migrations: {
    glob: 'migrations/*.up.sql',
    resolve: ({ name, path, context: sqlite }) => {
      if (!path) {
        throw new Error(`Migration file path is undefined for migration: ${name}`)
      }

      return {
        name,
        up: async () => {
          const sql = fs.readFileSync(path).toString()
          return sqlite.exec(sql)
        },
        down: async () => {
          // Get the corresponding `.down.sql` file to undo this migration
          const sql = fs
            .readFileSync(path.replace('.up.sql', '.down.sql'))
            .toString()
          return sqlite.exec(sql)
        },
      }
    },
  },
  context: db,
  logger: console,
})
