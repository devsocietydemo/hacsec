var express = require('express');
var { getCustomer, getAllCustomerAccounts } = require('../common/db/customers');
var { validateCustomerSession } = require('../common/redis/sessions');
var { sendCorrectResult, sendErrorMessage } = require('../common/http/handler');
var { STANDARD_ACCESS_DENIED_ERROR } = require('../common/app/errors');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  const customerId = req.params.id;
  const sessionId = req.headers.sessionid;
  if (sessionId) {
    validateCustomerSession(res.locals.redisClient, sessionId, customerId)
      .then( () => getCustomer(res.locals.connection, customerId) )
      .then( results => sendCorrectResult(res, results) )
      .catch( error => sendErrorMessage(res, error) )
  } else {
    sendErrorMessage(res, STANDARD_ACCESS_DENIED_ERROR);
  }
});

router.get('/:id/accounts', function(req, res, next) {
	const customerId = req.params.id;
  const sessionId = req.headers.sessionid;
  if (sessionId) {
    validateCustomerSession(res.locals.redisClient, sessionId, customerId)
      .then( success => success ? getAllCustomerAccounts(res.locals.connection, customerId) : Promise.reject(STANDARD_ACCESS_DENIED_ERROR) )
      .then( results => sendCorrectResult(res, results) )
      .catch( error => sendErrorMessage(res, error) )
  } else {
    sendErrorMessage(res, STANDARD_ACCESS_DENIED_ERROR);
  }
});

module.exports = router;
