var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.locals.connection.query('SELECT * from accounts', function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});

router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	res.locals.connection.query('SELECT * from accounts where id = ' + id, function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});

router.get('/:id/transactions', function(req, res, next) {
	const id = req.params.id;
	res.locals.connection.query('SELECT tr.id from accounts acc, transactions tr where acc.id = tr.account_id and acc.id = ' + id, function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});


module.exports = router;