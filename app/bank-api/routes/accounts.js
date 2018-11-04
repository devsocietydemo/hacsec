var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.locals.connection.query('SELECT id, iban, balance, currency from accounts', function (error, results, fields) {
		if (error) {
			res.status(500).send({error: "Database query failed, error message: " + error});
		} else {
			res.status(200).send(results);
		}
	});
});

router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	res.locals.connection.query('SELECT a.*, o.account_name from accounts a LEFT JOIN account_ownership o ON (o.account_id = a.id) where id = ' + id, function (error, results, fields) {
		if (error) {
			res.status(500).send({error: "Database query failed, error message: " + error});
		} else {
			res.status(200).send(results);
		}
	});
});

router.get('/:id/transactions', function(req, res, next) {
	const id = req.params.id;
	res.locals.connection.query('SELECT tr.id, tr.transaction_date, tr.amount, tr.description, tr.target_iban from accounts acc, transactions tr where acc.id = tr.account_id and acc.id = ' + id, function (error, results, fields) {
		if (error) {
			res.status(500).send({error: "Database query failed, error message: " + error});
		} else {
			res.status(200).send(results);
		}
	});
});


module.exports = router;
