var uid = require('uid-safe');
var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
	const requestBody = req.body;
	res.locals.connection.query('SELECT COUNT(*) AS matches FROM customers WHERE id=' + requestBody.id +
	  ' AND password = \'' + requestBody.password + '\''
		, function (error, results, fields) {
			if (error) throw error;
			var loginResponse = { success: false, sessionId: null};
			if (results[0].matches == 1) {
				loginResponse.success = true;
				loginResponse.sessionId = uid.sync(18);
			}
			res.send(JSON.stringify({ "status": 200, "error": null, "response": loginResponse }));
		});
});

module.exports = router;