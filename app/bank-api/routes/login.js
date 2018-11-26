var uid = require('uid-safe');
var express = require('express');
var sha256 = require('js-sha256');
var async = require('async');
var router = express.Router();

router.post('/', function (req, res, next) {
	const requestBody = req.body;
	console.log([requestBody.id, sha256(requestBody.password)]);
	res.locals.connection.query('SELECT COUNT(*) AS matches FROM customers ' +
															'WHERE id=? AND password=?', [requestBody.id, sha256(requestBody.password)], 
		function (error, results, fields) {
			if (error) {
				res.status(500).send({error: `Database query failed, error message: ${error}`});
			} else {
				var loginResponse = { success: false, sessionId: null};
				console.log(results);
				if (results[0].matches == 1) {
					loginResponse.success = true;
					loginResponse.sessionId = uid.sync(18);
					res.locals.redisClient.set(loginResponse.sessionId, requestBody.id, function(err, status) {
						if (err) {
							res.status(500).send({error: `Session initialization failed, error message: ${err}`});
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
			res.status(500).send({error: `Redis query failed, error message: ${err}`});
		} else {
			async.map(replies, function(key, callback) {
				res.locals.redisClient.get(key, function(error, value) {
					if (error) return callback(error);
					var entry = { sessionId: key, customerId: value };
					callback(null, entry);
				})
			}, function(error, results) {
				if (error) {
					res.status(500).send({error:`Error when querying Redis: ${error}`});
				} else {
					res.status(200).send(results);
				}
			})
		}
	});
});

module.exports = router;