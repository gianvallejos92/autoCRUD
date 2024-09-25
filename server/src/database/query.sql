CREATE DATABASE autocrud;

USE autocrud;

-- CREATE TABLES --
DROP TABLE IF EXISTS `object`;
CREATE TABLE `object` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `API_Name` varchar(255) DEFAULT NULL,
  `Plural_Name` varchar(255) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  `LastModifiedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `API_Name_UNIQUE` (`API_Name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- STORED PROCEDURES --
DELIMITER //
CREATE PROCEDURE insert_object(NameVar VARCHAR(255), API_NameVar VARCHAR(255), Plural_NameVar VARCHAR(255))
BEGIN

	INSERT INTO Object (Name, API_Name, Plural_Name, CreatedDate, LastModifiedDate) VALUES (NameVar, API_NameVar, Plural_NameVar, NOW(), NOW());
    
END //
DELIMITER ;
