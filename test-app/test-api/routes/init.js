var uid = require('uid-safe');
var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
	const requestBody = req.body;
	var loginResponse = { sessionId: null, hostname: null };
	loginResponse.sessionId = uid.sync(18);
	loginResponse.hostname = process.env.TESTAPI_HOST_HOSTNAME;
	res.locals.redisClient.set(loginResponse.sessionId, requestBody.id, 'EX', 300, function(err, result) {
		if (err || result!=="OK") {
			res.status(500).send({ "error": "Unable to establish session in Redis cache, result was: " + result });
		} else {
			res.status(200).send(loginResponse);
		}
	});
	
});

router.get('/sessions', function (req, res, next) {
	res.locals.redisClient.keys('*', function(err, replies) {
    res.status(200).send(replies);
	});
});

module.exports = router;