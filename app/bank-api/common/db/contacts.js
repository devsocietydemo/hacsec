const getAllCustomerContacts = function(connection, customerId, callback) {
  connection.query('SELECT * from contacts WHERE customer_id = ?', [customerId], 
    function (error, results) {
      if (error) {
        callback(`Database query failed, error message: ${error}`, null);
      } else {
        callback(null, results);
      }
    }
  );
}

const addCustomerContact = function(connection, customerId, name, iban, callback) {
  connection.query('INSERT INTO contacts (name, iban, customer_id) VALUES (?, ?, ?)', [name,iban,customerId],
    function (error, results) {
      if (error) {
        callback(`Database query failed, error message: ${error}`, null);
      } else {
        callback(null, results);
      }
    }
  );
}

module.exports = { getAllCustomerContacts, addCustomerContact }