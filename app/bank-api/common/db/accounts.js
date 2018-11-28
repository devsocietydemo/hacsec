const getAccountDetails = function (connection, customerId, accountId, callback) {
  connection.query('SELECT a.id, a.iban, a.balance, a.currency, o.account_name ' + 
                   'FROM accounts a LEFT JOIN account_ownership o ON (o.account_id = a.id) ' +
                   'WHERE a.id = ? and o.customer_id = ?', [accountId, customerId], 
    function (error, results) {
      if (error) {
        callback(`Database query failed, error message: ${error}`, null);
      } else {
        callback(null, results);
      }
    }
  );
}

const getAccountOwnership = function(connection, customerId, accountId, callback) {
  connection.query('SELECT ownership_mode FROM account_ownership ' + 
                    'WHERE account_id=? AND customer_id=?',
                    [accountId, customerId], 
    function(error, results) {
      if (error) {
        callback(error, null);
      } else {
        if (results[0]) {
          callback(null, results[0].ownership_mode);
        } else {
          callback(null, null);
        }
      }
    }
  );
};

module.exports = { getAccountDetails, getAccountOwnership }