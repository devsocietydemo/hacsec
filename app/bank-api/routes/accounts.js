var express = require('express');
var { getAccountDetails, getAccountOwnership } = require('../common/db/accounts');
var { getAllAccountTransactions } = require('../common/db/transactions');
var { getCustomerIdFromSession } = require('../common/redis/sessions');
var router = express.Router();

router.get('/:id', function(req, res, next) {
	const accountId = req.params.id;
  const sessionId = req.headers.sessionid;
  if (sessionId) {
    getCustomerIdFromSession(res.locals.redisClient, sessionId, function(error, customerId) {
      if (error) {
        res.status(500).send({error: `Access validation failed: ${error}`});
      } else if (customerId) {
        getAccountOwnership(res.locals.connection, customerId, accountId, function(error, access_mode) {
          if (error) {
            res.status(500).send({error: `Access validation failed: ${error}`});
          } else {
            if (access_mode !== 'O' && access_mode !== 'P') {
              res.status(401).send({error: 'Access denied'});
            } else {
              getAccountDetails(res.locals.connection, customerId, accountId, function (error, results) {
                if (error) {
                  res.status(500).send({error: `${error}`});
                } else {
                  res.status(200).send(results);
                }
              });
            }
          }
        });
      } else {
        res.status(401).send({error: 'Access denied'});      }
    });
  }
});

router.get('/:id/transactions', function(req, res, next) {
	const accountId = req.params.id;
  const sessionId = req.headers.sessionid;
  if (sessionId) {
    getCustomerIdFromSession(res.locals.redisClient, sessionId, function(error, customerId) {
      if (error) {
        res.status(500).send({error: `Access validation failed: ${error}`});
      } else if (customerId) {
        getAccountOwnership(res.locals.connection, customerId, accountId, function(error, access_mode) {
          if (error) {
            res.status(500).send({error: `Access validation failed: ${error}`});
          } else {
            if (access_mode !== 'O' && access_mode !== 'P') {
              res.status(401).send({error: 'Access denied'});
            } else {
              getAllAccountTransactions(res.locals.connection, accountId, function(error, results) {
                if (error) {
                  res.status(500).send({error: `${error}`});
                } else {
                  res.status(200).send(results);
                }
              });
            }
          }
        });
      } else {
        res.status(401).send({error: 'Access denied'});      
      }
    });
  }
});

module.exports = router;
