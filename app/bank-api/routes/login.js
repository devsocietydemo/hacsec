var uid = require('uid-safe');
var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
	const requestBody = req.body;
	res.locals.connection.query('SELECT COUNT(*) AS matches FROM customers WHERE id=' + requestBody.id +
	  ' AND password = \'' + requestBody.password + '\''
		, function (error, results, fields) {
			if (error) {
				res.status(500).send({error: "Database query failed, error message: " + error});
			} else {
				var loginResponse = { success: false, sessionId: null};
				if (results[0].matches == 1) {
					loginResponse.success = true;
					loginResponse.sessionId = uid.sync(18);
					res.locals.redisClient.set(loginResponse.sessionId, requestBody.id, function(err, status) {
						if (err) {
							res.status(500).send({error: "Session initialization failed, error message: " + err});
						} else {
							res.status(200).send(loginResponse);
						}
					});
				} else {
					res.status(200).send(loginResponse);
				}
			}
		});
});

router.get('/sessions', function (req, res, next) {
	res.locals.redisClient.keys('*', function(err, replies) {
		if (err) {
			res.status(500).send({error: "Redis query failed, error message: " + err});
		} else {
			res.status(200).send(replies);
		}
	});
});

module.exports = router;