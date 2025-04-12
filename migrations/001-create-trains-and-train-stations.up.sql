CREATE TABLE `TrainStation` (
    `id` INTEGER PRIMARY KEY,
    `name` varchar(255),
    `traffic` int,
    `latitude` float,
    `longitude` float
);

CREATE TABLE `Train` (
     `id` INTEGER PRIMARY KEY,
     `date` datetime,
     `trainNo` varchar(255),
     `entity` varchar(255),
     `axe` varchar(255),
     `originIata` varchar(255),
     `destinationIata` varchar(255),
     `origin` varchar(255),
     `destination` varchar(255),
     `departureDateTime` datetime,
     `arrivalDateTime` datetime,
     `isEligibleForMaxSubscription` INTEGER,
     `insertedAt` datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `Train_index_0` ON `Train` (`origin`);
CREATE INDEX `Train_index_1` ON `Train` (`destination`);
CREATE INDEX `Train_index_2` ON `Train` (`departureDateTime`);
CREATE INDEX `Train_index_3` ON `Train` (`arrivalDateTime`);
CREATE INDEX `Train_index_4` ON `Train` (`originIata`);
CREATE INDEX `Train_index_5` ON `Train` (`destinationIata`);
CREATE INDEX `Train_index_6` ON `Train` (`isEligibleForMaxSubscription`);
