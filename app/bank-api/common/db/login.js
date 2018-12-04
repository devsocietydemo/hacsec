const validateCustomerPassword = function(connection, customerId, password) {
  return new Promise( function(resolve, reject) {
    connection.query('SELECT COUNT(*) AS matches FROM customers ' +
                     'WHERE id=? AND password=SHA2(?, 256)', [customerId, password], 
      function (error, results) {
        if (error) {
          reject({code: 500, message: `Database query failed, error message: ${error}`});
        } else {
          resolve(results[0].matches === 1);
        }
      }
    );
  });
}

module.exports = { validateCustomerPassword }