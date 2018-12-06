var express = require('express');
var { getCustomer, getAllCustomerAccounts } = require('../common/db/customers');
var { validateCustomerSession } = require('../common/redis/sessions');
var { checkIfSessionExists, sendCorrectResult, sendErrorMessage } = require('../common/http/handler');
var { STANDARD_ACCESS_DENIED_ERROR } = require('../common/app/errors');
var router = express.Router();

router.get('/:id', function(req, res) {
  const customerId = req.params.id;
  const sessionId = req.headers.sessionid;
  checkIfSessionExists(sessionId)
    .then( sessionId => validateCustomerSession(res.locals.redisClient, sessionId, customerId))
    .then( success => success ? getCustomer(res.locals.driver, customerId) : Promise.reject(STANDARD_ACCESS_DENIED_ERROR) )
    .then( results => sendCorrectResult(res, results) )
    .catch( error => sendErrorMessage(res, error) )
});

router.get('/:id/accounts', function(req, res) {
	const customerId = req.params.id;
  const sessionId = req.headers.sessionid;
  checkIfSessionExists(sessionId)
    .then ( sessionId => validateCustomerSession(res.locals.redisClient, sessionId, customerId))
    .then( success => success ? getAllCustomerAccounts(res.locals.driver, customerId) : Promise.reject(STANDARD_ACCESS_DENIED_ERROR) )
    .then( results => sendCorrectResult(res, results) )
    .catch( error => sendErrorMessage(res, error) )
});

module.exports = router;
