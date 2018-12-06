var express = require('express');
var { deleteCustomerSession } = require('../common/redis/sessions');
var { checkIfSessionExists, sendCorrectResult, sendErrorMessage } = require('../common/http/handler');
var router = express.Router();

router.post('/', function (req, res) {
	const sessionId = req.headers.sessionid;
  checkIfSessionExists(sessionId)
    .then( sessionId => deleteCustomerSession(res.locals.redisClient, sessionId) )
    .then( result => sendCorrectResult(res, {success:result}) )
    .catch( error => sendErrorMessage(res, error) );
});

module.exports = router;