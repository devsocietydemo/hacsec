var express = require('express');
var redis = require('redis');
var router = express.Router();

router.post('/', function (req, res, next) {
	const requestBody = req.body;
	const sessionId = req.headers.sessionid;
	if (sessionId) { 
		res.locals.redisClient.del(sessionId); 
	}
  res.send(JSON.stringify({ "status": 200, "error": null, "response": true }));
});

module.exports = router;