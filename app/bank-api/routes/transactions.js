var express = require('express');
var { createNewTransaction } = require('../common/db/transactions');
var router = express.Router();

router.post('/', function (req, res, next) {
  const requestBody = req.body;
  createNewTransaction(res.locals.connection, requestBody.account_id, new Date().toLocaleString(), requestBody.amount, requestBody.description, requestBody.target_iban, 
    function (error, results) {
			if (error) {
				res.status(500).send({error: `${error}`});
			} else {
				res.status(200).send(results);
			}
		});
});

module.exports = router;