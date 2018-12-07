var uid = require('uid-safe');
const { REDIS_ERROR_CODES } = require('./errors');

const getRedisConnectionStatus = function(redisClient) {
  return new Promise (function (resolve, reject) {
    redisClient.get('no-such-session', function(error, data) {
      if (error) {
        reject({code: REDIS_ERROR_CODES.REDIS_QUERY_FAILED, message: error})
      } else {
        if (data) {
          resolve(true);
        } else {
          resolve(true);
        }
      }
    });
  })
}

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

const getAllKeysFromRedis = function(redisClient) {
  return new Promise(function(resolve, reject) {
    redisClient.keys('*', function(error, replies) {
      if (error) {
        reject({code: REDIS_ERROR_CODES.REDIS_QUERY_FAILED, message: `Fetching all keys failed: ${error}`});
      } else {
        resolve(replies);
      }
    });
  });
}

const getAllCustomersSessions = function(redisClient) {
  return getAllKeysFromRedis(redisClient)
    .then(sessions => Promise.all(sessions.map(sessionId => getCustomerIdFromSession(redisClient, sessionId).then(customerId => ({customerId, sessionId})))))
    .then(results => results.reduce(
      function(acc, curr) {
        var key = curr.customerId;
        if (!acc[key]) { 
          acc[key] = []
        }
        acc[key].push(curr.sessionId);
        return acc;
      },
    {}))
    .then(results => Object.keys(results).map(key => ({customerId: key, sessions: results[key]})))
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

module.exports = { getRedisConnectionStatus, createCustomerSession, getCustomerIdFromSession, getAllCustomersSessions, deleteCustomerSession, validateCustomerSession }