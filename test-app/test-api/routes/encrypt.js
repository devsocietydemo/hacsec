var express = require('express');
var mysql = require("mysql");
var router = express.Router();
var {validateCustomerSession} = require('../common/security');

//SELECT SHA2(CONCAT(SHA2(CONCAT('dawid.buchwald@cgi.com','alskdlkdalskd'), 256), salt), 256) FROM salts WHERE id=10001;

router.post('/', function (req, res, next) {
	const requestBody = req.body;
	const id = requestBody.id;
	const sessionId = req.headers.sessionid;
	validateCustomerSession(res.locals.redisClient, sessionId, id, function(err, success) {
		if (err) throw err;
		if (success) {
			res.locals.connection = mysql.createConnection({
				host: process.env.TESTAPI_DB_HOSTNAME,
				user: 'testappuser',
				password: 'TestAppPassword',
				database: 'testdb',
				multipleStatements: true
			});
			res.locals.connection.connect();
			res.locals.connection.query('SELECT SHA2(CONCAT(SHA2(CONCAT("' + requestBody.email + '", "' + requestBody.hostname + '"), 256), salt), 256) AS hash FROM salts WHERE id=10001', function (error, results, fields) {
				if (error) throw error;
				res.send(JSON.stringify({ "status": 200, "error": null, "response": results[0] }));
			});
		} else {
			res.send(JSON.stringify({"status": 401, "error": "Access denied"}));
		}
	});
});

module.exports = router;