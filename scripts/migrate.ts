import getUmzug from './umzug.js'

const umzug = getUmzug({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/max-explorer',
})

async function migrate() {
  try {
    const migrations = await umzug.up()
    console.log('Applied migrations:', migrations.map(m => m.name))
    console.log('Migration successful.')
    process.exit(0)
  }
  catch (e) {
    console.error('Migration failed:', e)
    process.exit(1)
  }
}

async function rollback() {
  try {
    await umzug.down()
    console.log('Rollback successful.')
    process.exit(0)
  }
  catch (e) {
    console.error('Rollback failed:', e)
    process.exit(1)
  }
}

const command = process.argv[2]

if (command === 'up') {
  await migrate()
}
else if (command === 'down') {
  await rollback()
}
else {
  console.log('Invalid command, use "up" to migrate or "down" to rollback the last migration.')
}
