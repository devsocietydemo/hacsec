var express = require('express');
var router = express.Router();
var {validateCustomerSession} = require('../common/security');

// router.get('/', function(req, res, next) {
// 	res.locals.connection.query('SELECT * from customers', function (error, results, fields) {
// 		if (error) {
// 			res.status(500).send({error: "Database query failed, error message: " + error});
// 		} else {
// 			res.status(200).send(results);
// 		}
// 	});
// });

router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	res.locals.connection.query('SELECT * from customers where id = ' + id, function (error, results, fields) {
		if (error) {
			res.status(500).send({error: "Database query failed, error message: " + error});
		} else {
			res.status(200).send(results);
		}
	});
});

router.get('/:id/accounts', function(req, res, next) {
	const id = req.params.id;
	const sessionId = req.headers.sessionid;
	validateCustomerSession(res.locals.redisClient, sessionId, id, function(err, success) {
		if (err) {
			res.status(500).send({error: `Session validation failed, error message: ${err}`});
		} else if (success) {
			res.locals.connection.query('SELECT ' + 
																	'  o.account_id as id, ' + 
																	'  o.ownership_mode, ' + 
																	'  o.account_name, ' +
																	'  a.iban, ' + 
																	'  a.currency, ' + 
																	'  a.balance ' +
																	'FROM ' +
																	'  account_ownership o ' +
																	'JOIN ' +
																	'  accounts a ' +
																	'ON ' +
																	'  (a.id = o.account_id) ' +
																	'WHERE ' +
																	'  customer_id = ?', [id], 
				function (error, results, fields) {
					if (error) {
						res.status(500).send({error: "Database query failed, error message: " + error});
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
