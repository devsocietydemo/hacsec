var express = require('express');
var router = express.Router();
var { getCustomer, getAllCustomerAccounts } = require('../common/db/customers');
var { validateCustomerSession } = require('../common/redis/sessions');

router.get('/:id', function(req, res, next) {
	const customerId = req.params.id;
	getCustomer(res.locals.connection, customerId, function (error, results) {
		if (error) {
			res.status(500).send({error: `${error}`});
		} else {
			res.status(200).send(results);
		}
	});
});

router.get('/:id/accounts', function(req, res, next) {
	const customerId = req.params.id;
	const sessionId = req.headers.sessionid;
	validateCustomerSession(res.locals.redisClient, sessionId, customerId, function(error, success) {
		if (error) {
			res.status(500).send({error: `Session validation failed, error message: ${error}`});
		} else if (success) {
      getAllCustomerAccounts(res.locals.connection, customerId, 
				function (error, results) {
					if (error) {
						res.status(500).send({error: `${error}`});
					} else {
						res.status(200).send(results);
					}
			  });
		} else {
			res.status(401).send({ error: "Access denied"});
		}		
  });
});

module.exports = router;
