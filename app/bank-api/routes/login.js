var express = require('express');
var { validateCustomerPassword } = require('../common/db/login');
var { createCustomerSession, getAllCustomersSessions } = require('../common/redis/sessions');
var router = express.Router();

const processLogin = function(connection, redisClient, customerId, password) {
  return new Promise( function (resolve, reject) {
    validateCustomerPassword(connection, customerId, password)
      .then( function (status) {
        if (status) {
          createCustomerSession(redisClient, customerId)
            .then( function(sessionId) {
              resolve({success:true, sessionId});
            })
            .catch( function(error) {
              reject(error);
            });
        } else {
          resolve({success:false, sessionId:null});
        }
      });
    }
  );
}

router.post('/', function (req, res, next) {
	const customerId = req.body.id;
  const password = req.body.password;
  processLogin(res.locals.connection, res.locals.redisClient, customerId, password)
    .then( function (loginResponse) { res.status(200).send(loginResponse) })
    .catch( function (error) { res.status(500).send({ error: `${error}`}) });
	// validateCustomerPassword(res.locals.connection, customerId, password, 
	// 	function(error, passwordValid) {
	// 		if (error) {
	// 			res.status(500).send({error: `Database query failed, error message: ${error}`});
	// 		} else {
	// 			var loginResponse = { success: false, sessionId: null};
	// 			if (passwordValid) {
	// 				createCustomerSession(res.locals.redisClient, customerId, 
	// 					function(error, sessionId) {
	// 						if (error) {
	// 							res.status(500).send({error: `Session initialization failed, error message: ${error}`});
	// 						} else if (sessionId) {
	// 							loginResponse.success = true;
	// 							loginResponse.sessionId = sessionId;
	// 							res.status(200).send(loginResponse);
	// 						} else {
	// 							res.status(500).send({error:'Unable to establish session in Redis'})
	// 						}
	// 					}
	// 				);
	// 			} else {
	// 				res.status(200).send(loginResponse);
	// 			}
	// 		}
	// 	}
	// );
});

router.get('/sessions', function (req, res, next) {
	getAllCustomersSessions(res.locals.redisClient, function(error, results) {
		if (error) {
			res.status(500).send({error: `Redis query failed, error message: ${err}`});
		} else {
			res.status(200).send(results);
		}
	})
});

module.exports = router;