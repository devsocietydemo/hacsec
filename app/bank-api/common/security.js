var redis = require('redis');

const validateCustomerSession = function(redisClient, sessionId, customerId, callback) {
  redisClient.get(sessionId, function(err, data) {
    if (err) {
      callback(err, null)
    } else if (data == customerId) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
};

const validateCustomerAccessToAccount = function(redisClient, connection, sessionId, accountId, callback) {
  redisClient.get(sessionId, function(err, data) {
    if (err) {
      callback(err, null);
    };
    if (data == null) {
      callback(null, null);
    } else {
      connection.query('SELECT ownership_mode FROM account_ownership ' + 
                       'WHERE account_id=? AND customer_id=?',
                       [accountId, data], 
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
        });
    }
  });
};

module.exports = { validateCustomerSession, validateCustomerAccessToAccount };