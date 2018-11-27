var uid = require('uid-safe');
var async = require('async');

const createCustomerSession = function(redisClient, customerId, callback) {
  uid(18, 
    function(error, sessionId) {
      if (error) {
        callback(`Safe-UID generate failed with error: ${error}`, null);
      } else if (sessionId) {
        redisClient.set(sessionId, customerId, 
          function(error, status) {
            if (error) {
              callback(`Session initialization failed in Redis: ${error}`, null);
            } else if (status === 'OK') {
              callback(null, sessionId);
            } else {
              callback(`Session initialization in Redis responded with ${status}`, null);
            }
         }
        )
      } else {
        callback(`Unable to generate Safe-UID`, null);
      }
    }
  );
}

const getAllCustomersSessions = function(redisClient, callback) {
	redisClient.keys('*', function(error, replies) {
		if (error) {
			callback(`Redis query failed, error message: ${error}`, null);
		} else {
			async.map(replies, function(key, cb) {
				redisClient.get(key, function(error, value) {
					if (error) return cb(error);
					var entry = { customerId: value, sessionId: key };
					cb(null, entry);
				})
			}, function(error, results) {
				if (error) {
					callback(`Error when querying Redis: ${error}`, null);
				} else {
					callback(null, results.reduce(
            function(acc, curr) 
              { 
                var key = curr.customerId;
                if (!acc[key]) { 
                  acc[key] = []
                }
                acc[key].push(curr.sessionId);
                return acc;
              },
            {}
            )
          );
				}
			})
		}
	});
};

module.exports = { createCustomerSession, getAllCustomersSessions }