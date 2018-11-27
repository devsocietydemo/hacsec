var express = require('express');
var { validateCustomerPassword } = require('../common/db/login');
var { createCustomerSession, getAllCustomersSessions } = require('../common/redis/sessions');
var router = express.Router();

router.post('/', function (req, res, next) {
	const customerId = req.body.id;
	const password = req.body.password;
	validateCustomerPassword(res.locals.connection, customerId, password, 
		function(error, passwordValid) {
			if (error) {
				res.status(500).send({error: `Database query failed, error message: ${error}`});
			} else {
				var loginResponse = { success: false, sessionId: null};
				if (passwordValid) {
					createCustomerSession(res.locals.redisClient, customerId, 
						function(error, sessionId) {
							if (error) {
								res.status(500).send({error: `Session initialization failed, error message: ${error}`});
							} else if (sessionId) {
								loginResponse.success = true;
								loginResponse.sessionId = sessionId;
								res.status(200).send(loginResponse);
							} else {
								res.status(500).send({error:'Unable to establish session in Redis'})
							}
						}
					);
				} else {
					res.status(200).send(loginResponse);
				}
			}
		}
	);
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