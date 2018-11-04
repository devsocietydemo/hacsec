var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
	const requestBody = req.body;
	const sessionId = req.headers.sessionid;
	if (sessionId) { 
		res.locals.redisClient.del(sessionId, function(err, status) {
			if (err) {
				res.status(500).send({error: "Unable to delete session, error message: " + err});
			} else {
				res.status(200).send();
			}
		}); 
	}
});

module.exports = router;