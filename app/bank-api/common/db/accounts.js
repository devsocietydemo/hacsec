const getAccountDetails = function (connection, customerId, accountId) {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT a.id, a.iban, a.balance, a.currency, o.account_name ' + 
                     'FROM accounts a LEFT JOIN account_ownership o ON (o.account_id = a.id) ' +
                     'WHERE a.id = ? and o.customer_id = ?', [accountId, customerId], 
      function (error, results) {
        if (error) {
          reject({code: 500, message: `Database query failed, error message: ${error}`});
        } else {
          resolve(results);
        }
      }
    );
  });
}

const getAccountOwnership = function(connection, customerId, accountId) {
  return new Promise( function(resolve, reject) {
    connection.query('SELECT ownership_mode FROM account_ownership ' + 
                     'WHERE account_id=? AND customer_id=?',
                     [accountId, customerId], 
      function(error, results) {
        if (error) {
          reject({code: 500, message: `Database query failed, error message: ${error}`});
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
    return Promise.reject({code: 401, message: 'Access denied'});
  } else {
    return Promise.resolve(); 
  }
}

module.exports = { getAccountDetails, getAccountOwnership, validateAccountOwnership }