var { MYSQL_ERROR_CODES } = require('./errors');

const getAllAccountTransactions = function(driver, accountId) {
  return new Promise(function(resolve, reject) {
    driver.query('SELECT id, transaction_date, amount, description, target_iban ' +
                 'FROM transactions tr WHERE tr.account_id = ?', [accountId], 
      function (error, results) {
        if (error) {
          reject({code: MYSQL_ERROR_CODES.MYSQL_QUERY_FAILED, message: `Database query failed, error message: ${error}`});
        } else {
          resolve(results);
        }
      }
    );
  });
}

const createNewTransaction = function(driver, accountId, transactionDate, amount, description, targetIBAN) {
  return new Promise(function(resolve, reject) {
    driver.query('INSERT INTO transactions (account_id, transaction_date, amount, description, target_iban) VALUES (?, ?, ?, ?, ?)',
                 [accountId, transactionDate, amount, description, targetIBAN],
      function (error, results) {
        if (error) {
          reject({code: MYSQL_ERROR_CODES.MYSQL_QUERY_FAILED, message: `Database query failed, error message: ${error}`});
        } else {
          resolve(results);
        }
      }
    );
  });
}

module.exports = { getAllAccountTransactions, createNewTransaction }