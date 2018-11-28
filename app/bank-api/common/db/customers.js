const getCustomer = function(connection, customerId, callback) {
  connection.query('SELECT * from customers where id = ' + customerId, 
    function (error, results) {
      if (error) {
        callback(`Database query failed, error message: ${error}`, null);
      } else {
        callback(null, results);
      }
    }
  );
}

const getAllCustomerAccounts = function(connection, customerId, callback) {
  connection.query('SELECT ' + 
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
        callback(`Database query failed, error message: ${error}`, null);
      } else {
        callback(null, results);
      }
    }
  );
}

module.exports = { getCustomer, getAllCustomerAccounts }