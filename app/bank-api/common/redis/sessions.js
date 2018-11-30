var uid = require('uid-safe');
var async = require('async');

const establishSessionInRedis = function (redisClient, customerId, sessionId) {
  return new Promise (function (resolve, reject) {
    redisClient.set(sessionId, customerId, 
      function(error, status) {
        if (error) {
          reject(`Session initialization failed in Redis: ${error}`);
        } else if (status === 'OKI') {
          resolve(sessionId);
        } else {
          reject(`Session initialization in Redis responded with ${status}`);
        }
      }
    );
  });
}

const createCustomerSession = function(redisClient, customerId) {
  return new Promise (function (resolve, reject) {
    uid(18, function(error, sessionId) {
      if (error) {
        reject(`Safe-UID generate failed with error: ${error}`);
      } else if (sessionId) {
        resolve(establishSessionInRedis(redisClient, customerId, sessionId));
      } else {
        reject('Unable to generate Safe-UID')
      }
    })
  });
}

const getCustomerIdFromSession = function(redisClient, sessionId, callback) {
  redisClient.get(sessionId, function(error, data) {
    if (error) {
      callback(error, null)
    } else {
      callback(null, data);
    }
  });
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

const deleteCustomerSession = function(redisClient, sessionId, callback) {
  redisClient.del(sessionId, function(error, status) {
    if (error) {
      callback(error, null);
    } else if (status === 0) {
      callback(null, false);
    } else {
      callback(null, true);
    }
  });
}

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

module.exports = { createCustomerSession, getCustomerIdFromSession, getAllCustomersSessions, deleteCustomerSession, validateCustomerSession }