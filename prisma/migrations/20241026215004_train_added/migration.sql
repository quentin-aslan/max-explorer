-- CreateTable
CREATE TABLE "Train" (
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
    "isEligibleForMaxSubscription" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE INDEX "Train_origin_idx" ON "Train"("origin");

-- CreateIndex
CREATE INDEX "Train_destination_idx" ON "Train"("destination");

-- CreateIndex
CREATE INDEX "Train_departureDateTime_idx" ON "Train"("departureDateTime");

-- CreateIndex
CREATE INDEX "Train_arrivalDateTime_idx" ON "Train"("arrivalDateTime");

-- CreateIndex
CREATE INDEX "Train_originIata_idx" ON "Train"("originIata");

-- CreateIndex
CREATE INDEX "Train_destinationIata_idx" ON "Train"("destinationIata");

-- CreateIndex
CREATE INDEX "Train_isEligibleForMaxSubscription_idx" ON "Train"("isEligibleForMaxSubscription");
