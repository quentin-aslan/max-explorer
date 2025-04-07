# Max Explorer

# Pre-requisites
> .env with `GOOGLE_API_KEY` and `DATABASE_URL` required.
1. Create the .env with the google map api key and the database_url.
2. `npm install`
3. `npx prisma migrate dev`
4. `npm run dev`

## Update the DataBase
1. First update the schema with your changes (prisma/schema.prisma)
2. Run `npx prisma migrate dev`
3. Run `npx prisma generate`


# How it's working ? 

## Get the trains data
The trains are from the SNCF API. (https://ressources.data.sncf.com/explore/dataset/tgvmax/information/)

The `import-trains.ts` file is used to import the trains data from the SNCF API to the database.
The trains data are refreshed every day at 7am with a cron. `server/cron/get-SNCF-data.ts`.
The trains can also be refreshed via an REST API. `/api/import-trains`.