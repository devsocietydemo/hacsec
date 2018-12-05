var express = require('express');
var { getAccountDetails, getAccountOwnership, validateAccountOwnership } = require('../common/db/accounts');
var { getAllAccountTransactions } = require('../common/db/transactions');
var { getCustomerIdFromSession } = require('../common/redis/sessions');
var { checkIfSessionExists, sendCorrectResult, sendErrorMessage } = require('../common/http/handler');
var router = express.Router();

router.get('/:id', function(req, res) {
	const accountId = req.params.id;
  const sessionId = req.headers.sessionid;
  var fetchedCustomerId;
  checkIfSessionExists(sessionId)
    .then( sessionId => getCustomerIdFromSession(res.locals.redisClient, sessionId))
    .then( customerId => fetchedCustomerId = customerId )
    .then( customerId => customerId ? getAccountOwnership(res.locals.connection, customerId, accountId) : null)
    .then( validateAccountOwnership )
    .then( () => getAccountDetails(res.locals.connection, fetchedCustomerId, accountId))
    .then( results => sendCorrectResult(res, results))
    .catch( error => sendErrorMessage(res, error));
});

router.get('/:id/transactions', function(req, res) {
	const accountId = req.params.id;
  const sessionId = req.headers.sessionid;
  checkIfSessionExists(sessionId)
    .then( sessionId => getCustomerIdFromSession(res.locals.redisClient, sessionId))
    .then( customerId => customerId ? getAccountOwnership(res.locals.connection, customerId, accountId) : null)
    .then( validateAccountOwnership )
    .then( () => getAllAccountTransactions(res.locals.connection, accountId))
    .then( results => sendCorrectResult(res, results) )
    .catch( error => sendErrorMessage(res, error) );
});

module.exports = router;
