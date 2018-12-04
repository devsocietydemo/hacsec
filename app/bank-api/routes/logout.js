var express = require('express');
var { deleteCustomerSession } = require('../common/redis/sessions');
var { STANDARD_ACCESS_DENIED_ERROR } = require('../common/app/errors');
var { sendCorrectResult, sendErrorMessage } = require('../common/http/handler');
var router = express.Router();

router.post('/', function (req, res) {
	const sessionId = req.headers.sessionid;
	if (sessionId) {
		deleteCustomerSession(res.locals.redisClient, sessionId)
			.then( result => sendCorrectResult(res, {success:result}) )
			.catch( error => sendErrorMessage(res, error) );
	} else {
		sendErrorMessage(res, STANDARD_ACCESS_DENIED_ERROR);
	}
});

module.exports = router;