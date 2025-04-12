# Max Explorer

# Pre-requisites
> .env with `DATABASE_URL` is optional, DATABASE_URL=sqlite.db is used by default.
2. `npm install`
3. `npm run migrate:up`
4. `npm run dev`

## Update the DataBase
1. Add your migration file in the `migrations` folder.
   2. Your migration file should have this format: `XXX-description.up.ts`
   3. Don't forget to add a rollback file with the same name but with `.down.ts` at the end.
   4. Check the first migration file for an example. (`migrations/001-create-trains-and-train-stations.up.ts`)
5. Run the migration with `npm run migrate:up`. (or rollback with `npm run migrate:down`)


# How it's working ? 

## Get the trains data
The trains are from the SNCF API. (https://ressources.data.sncf.com/explore/dataset/tgvmax/information/)

The `import-trains.ts` file is used to import the trains data from the SNCF API to the database.
The trains data are refreshed every day at 7am with a cron. `server/cron/get-SNCF-data.ts`.
The trains can also be refreshed via an REST API. `/api/import-trains`.