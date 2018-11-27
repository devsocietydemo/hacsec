const validateCustomerPassword = function(connection, customerId, password, callback) {
	connection.query('SELECT COUNT(*) AS matches FROM customers ' +
									 'WHERE id=? AND password=SHA2(?, 256)', [customerId, password], 
		function (error, results) {
			if (error) {
				callback(`Database query failed, error message: ${error}`, null);
			} else if (results[0].matches === 1) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  );
}

module.exports = { validateCustomerPassword }