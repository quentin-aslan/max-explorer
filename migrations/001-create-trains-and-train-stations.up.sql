-- Project definition
-- Database linked to the https://github.com/quentin-aslan/max-explorer/ project

-- Table: TrainStation
CREATE TABLE "TrainStation" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255),
    "traffic" INT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION
);

-- Table: Train
CREATE TABLE "Train" (
     "id" SERIAL PRIMARY KEY,
     "date" TIMESTAMP WITH TIME ZONE,
     "trainNo" VARCHAR(50),
     "entity" VARCHAR(50),
     "axe" VARCHAR(50),
     "originIata" VARCHAR(50),
     "destinationIata" VARCHAR(50),
     "origin" VARCHAR(255),
     "destination" VARCHAR(255),
     "departureDateTime" TIMESTAMP WITH TIME ZONE,
     "arrivalDateTime" TIMESTAMP WITH TIME ZONE,
     "isEligibleForMaxSubscription" BOOLEAN,
     "insertedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX ON "Train" ("origin");
CREATE INDEX ON "Train" ("destination");
CREATE INDEX ON "Train" ("departureDateTime");
CREATE INDEX ON "Train" ("arrivalDateTime");
CREATE INDEX ON "Train" ("originIata");
CREATE INDEX ON "Train" ("destinationIata");
CREATE INDEX ON "Train" ("isEligibleForMaxSubscription");
