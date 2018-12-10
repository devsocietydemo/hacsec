/*
 * Create application user and database
 */

DROP DATABASE IF EXISTS bankdb;
DROP USER IF EXISTS 'bankappuser'@'%';
FLUSH PRIVILEGES;
CREATE DATABASE bankdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bankappuser'@'%' IDENTIFIED BY 'AppUserPassword';
GRANT ALL PRIVILEGES ON *.* TO 'bankappuser'@'%';
GRANT GRANT OPTION ON *.* TO 'bankappuser'@'%';
FLUSH PRIVILEGES;

/*
 * Create database schema
 */

USE bankdb;

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS account_ownership;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers(id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(60) NOT NULL,
					             nationality CHAR(2) NOT NULL DEFAULT 'PL',
                       salt CHAR(64) NOT NULL,
						           password CHAR(64) NOT NULL);

ALTER TABLE customers AUTO_INCREMENT=2241;

CREATE TABLE accounts(id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      iban VARCHAR(26) NOT NULL UNIQUE,
					            balance NUMERIC(15,2) NOT NULL,
					            currency CHAR(3) NOT NULL DEFAULT 'EUR');

ALTER TABLE accounts AUTO_INCREMENT=86433;

CREATE TABLE account_ownership(customer_id INTEGER NOT NULL,
                               account_id INTEGER NOT NULL,
							                 ownership_mode ENUM('O', 'P'),
							                 account_name VARCHAR(50),
							                 PRIMARY KEY(customer_id, account_id),
							                 FOREIGN KEY(customer_id) REFERENCES customers(id),
							                 FOREIGN KEY(account_id) REFERENCES accounts(id));

CREATE TABLE transactions(id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                          account_id INTEGER NOT NULL,
													transaction_date DATETIME NOT NULL,
                          amount NUMERIC(15,2) NOT NULL,
                          description VARCHAR(500) NOT NULL,
						              target_iban VARCHAR(26),
                          FOREIGN KEY(account_id) REFERENCES accounts(id));

ALTER TABLE transactions AUTO_INCREMENT=12315671;

CREATE TABLE contacts(contact_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      name TEXT,
                      iban TEXT,
                      customer_id INTEGER NOT NULL,
                      FOREIGN KEY(customer_id) REFERENCES customers(id) );

ALTER TABLE contacts AUTO_INCREMENT=1000;

/*
 * Insert initial database
 */

LOAD DATA INFILE '/tmp/customers.csv'
INTO TABLE customers
FIELDS TERMINATED BY ','
(id, name, nationality, @password)
SET salt = MD5(rand()),
    password = SHA2(TRIM(TRAILING '\r' FROM @password), 256);

LOAD DATA INFILE '/tmp/accounts.csv'
INTO TABLE accounts
FIELDS TERMINATED BY ','
(id, iban, balance, currency);

LOAD DATA INFILE '/tmp/account_ownership.csv'
INTO TABLE account_ownership
FIELDS TERMINATED BY ','
(customer_id, account_id, ownership_mode, @account_name)
SET account_name = nullif(TRIM(TRAILING '\r' FROM @account_name), '');

LOAD DATA INFILE '/tmp/transactions.csv'
INTO TABLE transactions
FIELDS TERMINATED BY ','
(id, account_id, amount, @transaction_date, description, @target_iban)
SET target_iban = nullif(TRIM(TRAILING '\r' FROM @target_iban), ''),
    transaction_date = STR_TO_DATE(@transaction_date, '%d.%m.%Y %H:%i:%s');

LOAD DATA INFILE '/tmp/contacts.csv'
INTO TABLE contacts
FIELDS TERMINATED BY ','
(contact_id, name, @iban, customer_id)
SET iban = nullif(TRIM(TRAILING '\r' FROM @iban), '');

