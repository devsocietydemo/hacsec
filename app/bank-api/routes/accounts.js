var express = require('express');
var { getAccountDetails, getAccountOwnership, validateAccountOwnership } = require('../common/db/accounts');
var { getAllAccountTransactions } = require('../common/db/transactions');
var { getCustomerIdFromSession } = require('../common/redis/sessions');
var router = express.Router();

router.get('/:id', function(req, res, next) {
	const accountId = req.params.id;
  const sessionId = req.headers.sessionid;
  var fetchedCustomerId;
  if (sessionId) {
    getCustomerIdFromSession(res.locals.redisClient, sessionId)
      .then( customerId => fetchedCustomerId = customerId )
      .then( customerId => customerId ? getAccountOwnership(res.locals.connection, customerId, accountId) : null)
      .then( validateAccountOwnership )
      .then( () => getAccountDetails(res.locals.connection, fetchedCustomerId, accountId))
      .then( results => res.status(200).send(results))
      .catch( ({code, message}) => res.status(code).send({error:message}));
  } else {
    res.status(401).send({error: 'Access denied'});
  }
});

router.get('/:id/transactions', function(req, res, next) {
	const accountId = req.params.id;
  const sessionId = req.headers.sessionid;
  if (sessionId) {
    getCustomerIdFromSession(res.locals.redisClient, sessionId)
      .then( customerId => customerId ? getAccountOwnership(res.locals.connection, customerId, accountId) : null)
      .then( validateAccountOwnership )
      .then( () => getAllAccountTransactions(res.locals.connection, accountId))
      .then( results => res.status(200).send(results))
      .catch( ({code, message}) => res.status(code).send({error:message}) );
  } else {
    res.status(401).send({error: 'Access denied'});
  }
});

module.exports = router;
