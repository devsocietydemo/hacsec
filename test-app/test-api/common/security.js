var redis = require('redis');

const validateCustomerSession = function(redisClient, sessionId, customerId, callback) {
  redisClient.get(sessionId, function(err, data) {
    if (err) throw err;
    if (data == customerId) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
};

module.exports = { validateCustomerSession };