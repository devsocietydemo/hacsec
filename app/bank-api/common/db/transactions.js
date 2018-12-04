const getAllAccountTransactions = function(connection, accountId) {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT id, transaction_date, amount, description, target_iban ' +
                     'FROM transactions tr WHERE tr.account_id = ?', [accountId], 
      function (error, results) {
        if (error) {
          reject({code:500, message: `Database query failed: ${error}`});
        } else {
          resolve(results);
        }
      }
    );
  });
}

const createNewTransaction = function(connection, accountId, transactionDate, amount, description, targetIBAN, callback) {
  connection.query('INSERT INTO transactions (account_id, transaction_date, amount, description, target_iban) VALUES (?, ?, ?, ?, ?)',
                   [accountId, transactionDate, amount, description, targetIBAN],
    function (error, results) {
      if (error) {
        callback(`Database query failed, error message: ${error}`, null);
      } else {
        callback(null, results)
      }
    }
  );
}

module.exports = { getAllAccountTransactions, createNewTransaction }