/*
 * Create application user and database
 */

DROP DATABASE IF EXISTS testdb;
DROP USER IF EXISTS 'testappuser'@'%';
FLUSH PRIVILEGES;
CREATE DATABASE testdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'testappuser'@'%' IDENTIFIED BY 'TestAppPassword';
GRANT ALL PRIVILEGES ON *.* TO 'testappuser'@'%';
GRANT GRANT OPTION ON *.* TO 'testappuser'@'%';
FLUSH PRIVILEGES;

/*
 * Create database schema
 */

USE testdb;

DROP TABLE IF EXISTS salts;

CREATE TABLE salts(id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                   salt VARCHAR(32) NOT NULL);

ALTER TABLE salts AUTO_INCREMENT=10001;

/*
 * Insert initial database
 */

INSERT INTO salts (salt) VALUES ('Me0#l1$wQgSuh^DTV@pf5MlFCOQ4jy1r');
