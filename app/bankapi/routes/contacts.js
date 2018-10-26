var express = require('express');
var libxmljs = require('libxmljs');

var libxmlParseOptions = {
  nocdata: true,
  noblanks: true,
  noent: true
};

var router = express.Router();
var {validateCustomerSession} = require('../common/security');

router.get('/:customerId', function(req, res, next) {
	res.locals.connection.query('SELECT * from contacts WHERE customer_id = ' + req.params.customerId, function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});

router.post('/:customerId', function(req, res, next) {
  const {name, iban} = req.body;
  const customerId = req.params.customerId;

	res.locals.connection.query(
    `INSERT INTO contacts (name, iban, customer_id) VALUES ("${name}", "${iban}", "${customerId}")`,
    function (error, results, fields) {
  		if (error) throw error;
  		res.send(JSON.stringify({"status": 200, "error": null, "response": 'OK'}));
  	}
  );
});

router.post('/:customerId/xml', function(req, res, next) {
  const contacts = req.body.contactsXml;
  const parsedXml = libxmljs.parseXmlString(contacts, libxmlParseOptions);
  const content = parsedXml.find('//contacts/contact');

  const contactObjects = content.map(el => ({
    'name': el.get('name').text(),
    'iban': el.get('iban').text()
  }));

	res.locals.connection.query('DELETE FROM contacts WHERE customer_id = ' + req.params.customerId, function (error, results, fields) {
		if (error) throw error;

    const insert = contactObjects
      .map(obj => `INSERT INTO contacts (\`name\`, \`iban\`, \`customer_id\`)
      VALUES (
        "${obj.name.replace(/\n/g, '')}",
        "${obj.iban.replace(/\n/g, '')}",
        ${req.params.customerId}
      )`)
      .join('; \n');

    console.log(insert);

    res.locals.connection.query(insert, function (error, results) {
      if (error) throw error;

      res.send({"status": 200, "error": null, "response": contactObjects});
    });
	});
});

module.exports = router;
