# Max Explorer

## Prerequisites

> A `.env` file with `DATABASE_URL` is optional.

1. Install dependencies  
   `npm install`
2. Run the database (PostgreSQL) with Docker  
   `npm run docker:up`
3. Run database migrations  
   `npm run migrate:up`
4. Start the development server  
   `npm run dev`
---

## Database (PostgreSQL)
The database used is PostgreSQL, which is started with docker, using the `docker-compose.yml` file in the root directory.

Start the database :
`npm run docker:up` (or `docker-compose up`)

Stop the database :
`npm run docker:down` (or `docker-compose down`)


### Database Migrations

1. Add a migration file to the `migrations` folder
   - Format: `XXX-description.up.ts`
   - A corresponding rollback file is required: `XXX-description.down.ts`
   - See `migrations/001-create-trains-and-train-stations.up.ts` for an example

2. Run the migration  
   `npm run migrate:up`

3. To rollback the latest migration  
   `npm run migrate:down`

### Migration System

Migrations are managed using the [`umzug`](https://github.com/sequelize/umzug) package.

- Migration files are located in the `migrations` directory
- The `umzug` instance is configured in `scripts/umzug.ts`
- This instance is used in:
   - `scripts/migrations.ts`
   - `tests/setupTestDb.ts` (see the Testing section)

---

## Train Data Import

Train data is retrieved from the official SNCF API:  
[https://ressources.data.sncf.com/explore/dataset/tgvmax/information/](https://ressources.data.sncf.com/explore/dataset/tgvmax/information/)

- The file `scripts/import-trains.ts` is used to import data into the database
- Data is refreshed daily at 7 AM using a cron job: `server/cron/get-SNCF-data.ts`
- It can also be manually triggered via the API:  
  `POST /api/import-trains`

---

## Testing

Some trip search algorithms are complex and are covered by automated tests.

- Tests are located in the `tests` directory
- A Postgres database is used for testing
- The database is initialized and migrated by `tests/postgres-test-manager.ts`, which uses the shared `umzug` logic from the `scripts` folder
