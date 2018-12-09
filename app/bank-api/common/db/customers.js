const { MYSQL_ERROR_CODES } = require('./errors');

const getCustomer = function(driver, customerId) {
  return new Promise(function (resolve, reject) {
    driver.query('SELECT * from customers where id = ' + customerId, null, 
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

const getAllCustomerAccounts = function(driver, customerId) {
  return new Promise(function(resolve, reject) {
    driver.query('SELECT ' + 
                 '  o.account_id as id, ' + 
                 '  o.ownership_mode, ' + 
                 '  o.account_name, ' +
                 '  a.iban, ' + 
                 '  a.currency, ' + 
                 '  a.balance ' +
                 'FROM ' +
                 '  account_ownership o ' +
                 'JOIN ' +
                 '  accounts a ' +
                 'ON ' +
                 '  (a.id = o.account_id) ' +
                 'WHERE ' +
                 '  customer_id = ?', [customerId], 
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

module.exports = { getCustomer, getAllCustomerAccounts }