var express = require('express');
var { validateCustomerAccessToAccount } = require('../common/security');
var router = express.Router();

// router.get('/', function(req, res, next) {
// 	res.locals.connection.query('SELECT id, iban, balance, currency from accounts', function (error, results, fields) {
// 		if (error) {
// 			res.status(500).send({error: "Database query failed, error message: " + error});
// 		} else {
// 			res.status(200).send(results);
// 		}
// 	});
// });

router.get('/:id', function(req, res, next) {
	const accountId = req.params.id;
	const sessionId = req.headers.sessionid;
	validateCustomerAccessToAccount(res.locals.redisClient, res.locals.connection, sessionId, accountId, function(error, access_mode) {
		if (error) {
			res.status(500).send({error: `Access validation failed: ${error}`});
		} else {
			if (access_mode !== 'O' && access_mode !== 'P') {
				res.status(401).send({error: 'Access denied'});
			} else {
				res.locals.connection.query('SELECT a.*, o.account_name from accounts a LEFT JOIN account_ownership o ON (o.account_id = a.id) where id = ?', [accountId], function (error, results, fields) {
					if (error) {
						res.status(500).send({error: `Database query failed, error message: ${error}`});
					} else {
						res.status(200).send(results);
					}
				});
			}
		}
	});
});

router.get('/:id/transactions', function(req, res, next) {
	const accountId = req.params.id;
	const sessionId = req.headers.sessionid;
	validateCustomerAccessToAccount(res.locals.redisClient, res.locals.connection, sessionId, accountId, function(error, access_mode) {
		if (error) {
			res.status(500).send({error: `Access validation failed: ${error}`});
		} else {
			if (access_mode !== 'O' && access_mode !== 'P') {
				res.status(401).send({error: 'Access denied'});
			} else {
				res.locals.connection.query('SELECT tr.id, tr.transaction_date, tr.amount, tr.description, tr.target_iban from accounts acc, transactions tr where acc.id = tr.account_id and acc.id = ?', [accountId], function (error, results, fields) {
					if (error) {
						res.status(500).send({error: "Database query failed, error message: " + error});
					} else {
						res.status(200).send(results);
					}
				});
						}
		}
	});
	const id = req.params.id;
});

module.exports = router;
