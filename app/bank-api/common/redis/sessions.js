var uid = require('uid-safe');
var async = require('async');
const { REDIS_ERROR_CODES } = require('./errors');

const establishSessionInRedis = function (redisClient, customerId, sessionId) {
  return new Promise (function (resolve, reject) {
    redisClient.set(sessionId, customerId, 
      function(error, status) {
        if (error) {
          reject({code: REDIS_ERROR_CODES.SESSION_INIT_FAILED, message: `Session initialization failed in Redis: ${error}`});
        } else if (status === 'OK') {
          resolve(sessionId);
        } else {
          reject({code: REDIS_ERROR_CODES.SESSION_INIT_FAILED, message: `Session initialization in Redis responded with ${status}`});
        }
      }
    );
  });
}

const createCustomerSession = function(redisClient, customerId) {
  return new Promise (function (resolve, reject) {
    uid(18, function(error, sessionId) {
      if (error) {
        reject({code: REDIS_ERROR_CODES.UID_GENERATE_FAILED, message:`Safe-UID generate failed with error: ${error}`});
      } else if (sessionId) {
        resolve(establishSessionInRedis(redisClient, customerId, sessionId));
      } else {
        reject({code: REDIS_ERROR_CODES.UID_GENERATE_FAILED, message: 'Unable to generate Safe-UID'})
      }
    })
  });
}

const getCustomerIdFromSession = function(redisClient, sessionId) {
  return new Promise (function (resolve, reject) {
    redisClient.get(sessionId, function(error, data) {
      if (error) {
        reject({code: REDIS_ERROR_CODES.REDIS_QUERY_FAILED, message: error})
      } else {
        resolve(data);
      }
    });
  })
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

const deleteCustomerSession = function(redisClient, sessionId) {
  return new Promise(function(resolve, reject) {
    redisClient.del(sessionId, function(error, status) {
      if (error) {
        reject({code: REDIS_ERROR_CODES.SESSION_DESTROY_FAILED, message:`Session deletion failed: ${error}`});
      } else if (status === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

const validateCustomerSession = function(redisClient, sessionId, customerId) {
  return new Promise(function(resolve, reject) {
    redisClient.get(sessionId, function(error, data) {
      if (error) {
        reject({code: REDIS_ERROR_CODES.REDIS_QUERY_FAILED, message: `Redis query failed: ${error}`});
      } else if (data == customerId) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

module.exports = { createCustomerSession, getCustomerIdFromSession, getAllCustomersSessions, deleteCustomerSession, validateCustomerSession }