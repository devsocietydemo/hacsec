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
					   nationality CHAR(2) NOT NULL DEFAULT 'PL');
					   
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
                          amount NUMERIC(15,2) NOT NULL,
                          description VARCHAR(50) NOT NULL,
						  target_iban VARCHAR(26),
                          FOREIGN KEY(account_id) REFERENCES accounts(id));

ALTER TABLE transactions AUTO_INCREMENT=12315671;

/*
 * Insert initial database
 */

INSERT INTO customers (name, nationality) VALUES('Michael M. Barcus', 'PL');
set @last_customer_id = LAST_INSERT_ID();

INSERT INTO accounts (iban, balance, currency) VALUES('PL12 5234 4143 8746 7665', 2512.21, 'PLN');
set @last_account_id = LAST_INSERT_ID();

INSERT INTO account_ownership (customer_id, account_id, ownership_mode, account_name) VALUES (@last_customer_id, @last_account_id, 'O', 'Main checking account');

INSERT INTO transactions (account_id, amount, description, target_iban) VALUES (@last_account_id, 50.23, 'Carrefour 2141515', null);
INSERT INTO transactions (account_id, amount, description, target_iban) VALUES (@last_account_id, 121.51, 'Shell 456488', null);
INSERT INTO transactions (account_id, amount, description, target_iban) VALUES (@last_account_id, 160.00, 'Outgoing transfer', 'PL54 2315 1535 1241 6462');
