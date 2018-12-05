var express = require('express');
var { validateCustomerPassword } = require('../common/db/login');
var { createCustomerSession, getAllCustomersSessions } = require('../common/redis/sessions');
var { checkIfSessionExists, sendCorrectResult, sendErrorMessage } = require('../common/http/handler');
var router = express.Router();

router.post('/', function (req, res) {
	const customerId = req.body.id;
  const password = req.body.password;
  validateCustomerPassword(res.locals.connection, customerId, password)
    .then( validPassword => validPassword ? createCustomerSession(res.locals.redisClient, customerId) : null)
    .then( sessionId => sessionId ? {success:true, sessionId} : {success:false, sessionId})
    .then( loginResponse => sendCorrectResult(res, loginResponse) )
    .catch( error => sendErrorMessage(res, error) );
});

router.get('/sessions', function (req, res) {
  const sessionId =req.headers.sessionid;
  checkIfSessionExists(sessionId)
	  .then ( () => getAllCustomersSessions(res.locals.redisClient))
		.then( results => sendCorrectResult(res, results) )
		.catch( error => sendErrorMessage(res, error) );
});

module.exports = router;