const { MYSQL_ERROR_CODES } = require('./errors');
const { STANDARD_ACCESS_DENIED_ERROR } = require('../app/errors');

const getAccountDetails = function (driver, customerId, accountId) {
  return new Promise(function(resolve, reject) {
    driver.query('SELECT a.id, a.iban, a.balance, a.currency, o.account_name ' + 
                 'FROM accounts a LEFT JOIN account_ownership o ON (o.account_id = a.id) ' +
                 'WHERE a.id = ? and o.customer_id = ?', [accountId, customerId], 
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

const getAccountOwnership = function(driver, customerId, accountId) {
  return new Promise( function(resolve, reject) {
    driver.query('SELECT ownership_mode FROM account_ownership ' + 
                 'WHERE account_id=? AND customer_id=?',
                 [accountId, customerId], 
      function(error, results) {
        if (error) {
          reject({code: MYSQL_ERROR_CODES.MYSQL_QUERY_FAILED, message: `Database query failed, error message: ${error}`});
        } else {
          if (results[0]) {
            resolve(results[0].ownership_mode);
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};

const validateAccountOwnership = function(accountOwnership) {
  if (accountOwnership !== 'O' && accountOwnership !== 'P') {
    return Promise.reject(STANDARD_ACCESS_DENIED_ERROR);
  } else {
    return Promise.resolve(); 
  }
}

module.exports = { getAccountDetails, getAccountOwnership, validateAccountOwnership }