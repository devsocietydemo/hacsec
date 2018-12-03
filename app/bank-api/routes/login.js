var express = require('express');
var { validateCustomerPassword } = require('../common/db/login');
var { createCustomerSession, getAllCustomersSessions } = require('../common/redis/sessions');
var router = express.Router();

router.post('/', function (req, res, next) {
	const customerId = req.body.id;
  const password = req.body.password;

  validateCustomerPassword(res.locals.connection, customerId, password)
    .then( validPassword => validPassword ? createCustomerSession(res.locals.redisClient, customerId) : null)
    .then( sessionId => sessionId ? {success:true, sessionId} : {success:false, sessionId})
    .then( loginResponse => res.status(200).send(loginResponse))
    .catch( error => res.status(500).send({error}));
});

router.get('/sessions', function (req, res, next) {
	getAllCustomersSessions(res.locals.redisClient, function(error, results) {
		if (error) {
			res.status(500).send({error: `Redis query failed, error message: ${err}`});
		} else {
			res.status(200).send(results);
		}
	})
});

module.exports = router;