var express = require('express');
var { getAccountOwnership, validateAccountOwnership } = require('../common/db/accounts');
var { createNewTransaction } = require('../common/db/transactions');
var { getCustomerIdFromSession, validateCustomerSession } = require('../common/redis/sessions');
var { checkIfSessionExists, sendCorrectResult, sendErrorMessage } = require('../common/http/handler');
var router = express.Router();

router.post('/', function (req, res) {
  const requestBody = req.body;
  const sessionId = req.headers.sessionid;
  var fetchedCustomerId;
  checkIfSessionExists(sessionId)
    .then( sessionId => getCustomerIdFromSession(res.locals.redisClient, sessionId))
    .then( customerId => fetchedCustomerId = customerId)
    .then( validateCustomerSession(res.locals.redisClient, sessionId, fetchedCustomerId) )
    .then( success => success ? getAccountOwnership(res.locals.driver, fetchedCustomerId, requestBody.account_id) : null)
    .then( validateAccountOwnership )    
    .then( () => createNewTransaction(res.locals.driver, requestBody.account_id, new Date().toLocaleString(), requestBody.amount, requestBody.description, requestBody.target_iban) )
    .then( results => sendCorrectResult(res, results) )
    .catch( error => sendErrorMessage(res, error) )
});

module.exports = router;