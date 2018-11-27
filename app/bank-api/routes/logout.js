var express = require('express');
var { deleteCustomerSession } = require('../common/redis/sessions');
var router = express.Router();

router.post('/', function (req, res, next) {
	const requestBody = req.body;
	const sessionId = req.headers.sessionid;

	if (sessionId) { 
		deleteCustomerSession(res.locals.redisClient, sessionId, 
			function(error, status) {
				if (error) {
					res.status(500).send({error: `Unable to delete session, error message: ${error}`});
				} else {
					res.status(200).send();
				}
			}
		); 
	} else {
		res.status(500).send({error: 'Session id not provided'});
	}
});

module.exports = router;