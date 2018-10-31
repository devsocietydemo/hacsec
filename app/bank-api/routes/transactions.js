var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	res.locals.connection.query('SELECT * from transactions', function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
	});
});

router.get('/:id', function (req, res, next) {
	const id = req.params.id;
	res.locals.connection.query('SELECT * from transactions where id = ' + id, function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
	});
});

router.post('/', function (req, res, next) {
	const requestBody = req.body;
	res.locals.connection.query('INSERT INTO transactions (account_id, transaction_date, amount, description, target_iban) VALUES( '
		+ requestBody.account_id + ', "'+ new Date().toLocaleString() +'" , ' + requestBody.amount + ', "' + requestBody.description + '" , ' + requestBody.target_iban
		+ ' )'
		, function (error, results, fields) {
			if (error) throw error;
			res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
		});
});

module.exports = router;