var express = require('express');
var { getAccountDetails, getAccountOwnership, validateAccountOwnership } = require('../common/db/accounts');
var { getAllAccountTransactions } = require('../common/db/transactions');
var { getCustomerIdFromSession } = require('../common/redis/sessions');
var { sendCorrectResult, sendErrorMessage } = require('../common/http/handler');
var { STANDARD_ACCESS_DENIED_ERROR } = require('../common/app/errors');
var router = express.Router();

router.get('/:id', function(req, res) {
	const accountId = req.params.id;
  const sessionId = req.headers.sessionid;
  var fetchedCustomerId;
  if (sessionId) {
    getCustomerIdFromSession(res.locals.redisClient, sessionId)
      .then( customerId => fetchedCustomerId = customerId )
      .then( customerId => customerId ? getAccountOwnership(res.locals.connection, customerId, accountId) : null)
      .then( validateAccountOwnership )
      .then( () => getAccountDetails(res.locals.connection, fetchedCustomerId, accountId))
      .then( results => sendCorrectResult(res, results))
      .catch( error => sendErrorMessage(res, error));
  } else {
    sendErrorMessage(res, STANDARD_ACCESS_DENIED_ERROR);
  }
});

router.get('/:id/transactions', function(req, res) {
	const accountId = req.params.id;
  const sessionId = req.headers.sessionid;
  if (sessionId) {
    getCustomerIdFromSession(res.locals.redisClient, sessionId)
      .then( customerId => customerId ? getAccountOwnership(res.locals.connection, customerId, accountId) : null)
      .then( validateAccountOwnership )
      .then( () => getAllAccountTransactions(res.locals.connection, accountId))
      .then( results => sendCorrectResult(res, results) )
      .catch( error => sendErrorMessage(res, error) );
  } else {
    sendErrorMessage(res, STANDARD_ACCESS_DENIED_ERROR);
  }
});

module.exports = router;
