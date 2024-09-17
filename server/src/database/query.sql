CREATE DATABASE autocrud;

USE autocrud;

-- CREATE TABLES --
CREATE TABLE `object` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `API_Name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `field` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `API_Name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `isRequired` tinyint DEFAULT '0',
  `objectId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `objectId_idx` (`objectId`),
  CONSTRAINT `objectId` FOREIGN KEY (`objectId`) REFERENCES `object` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;