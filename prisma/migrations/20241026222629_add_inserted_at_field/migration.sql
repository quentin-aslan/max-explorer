-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Train" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "trainNo" TEXT NOT NULL,
    "entity" TEXT,
    "axe" TEXT,
    "originIata" TEXT NOT NULL,
    "destinationIata" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departureDateTime" DATETIME NOT NULL,
    "arrivalDateTime" DATETIME NOT NULL,
    "isEligibleForMaxSubscription" BOOLEAN NOT NULL,
    "insertedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Train" ("arrivalDateTime", "axe", "date", "departureDateTime", "destination", "destinationIata", "entity", "id", "isEligibleForMaxSubscription", "origin", "originIata", "trainNo") SELECT "arrivalDateTime", "axe", "date", "departureDateTime", "destination", "destinationIata", "entity", "id", "isEligibleForMaxSubscription", "origin", "originIata", "trainNo" FROM "Train";
DROP TABLE "Train";
ALTER TABLE "new_Train" RENAME TO "Train";
CREATE INDEX "Train_origin_idx" ON "Train"("origin");
CREATE INDEX "Train_destination_idx" ON "Train"("destination");
CREATE INDEX "Train_departureDateTime_idx" ON "Train"("departureDateTime");
CREATE INDEX "Train_arrivalDateTime_idx" ON "Train"("arrivalDateTime");
CREATE INDEX "Train_originIata_idx" ON "Train"("originIata");
CREATE INDEX "Train_destinationIata_idx" ON "Train"("destinationIata");
CREATE INDEX "Train_isEligibleForMaxSubscription_idx" ON "Train"("isEligibleForMaxSubscription");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
