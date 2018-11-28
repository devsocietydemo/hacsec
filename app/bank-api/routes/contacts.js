var express = require('express');
var libxmljs = require('libxmljs');
var { validateCustomerSession } = require('../common/redis/sessions')

var libxmlParseOptions = {
  nocdata: true,
  noblanks: true,
  noent: true
};

var router = express.Router();

router.get('/:customerId', function(req, res, next) {
  const customerId = req.params.customerId;
  validateCustomerSession(res.locals.redisClient, req.headers.sessionid, customerId, 
    function(error, success) {
      if (error) {
        res.status(500).send({error: `Session validation failed: ${error}`});
      } else if (success) {
        res.locals.connection.query('SELECT * from contacts WHERE customer_id = ?', [customerId], 
          function (error, results, fields) {
            if (error) {
              res.status(500).send({error: `Database query failed, error message: ${error}`});
            } else {
              res.status(200).send(results);
            }
          }
        );
      } else {
        res.status(401).send({error: `Access denied`});
      }
    }
  );
});

router.post('/:customerId', function(req, res, next) {
  const {name, iban} = req.body;
  const customerId = req.params.customerId;

  validateCustomerSession(res.locals.redisClient, req.headers.sessionid, req.params.customerId, 
    function(error, success) {
      if (error) {
        res.status(500).send({error: `Session validation failed: ${error}`});
      } else if (success) {
        res.locals.connection.query(
          'INSERT INTO contacts (name, iban, customer_id) VALUES (?, ?, ?)', [name,iban,customerId],
          function (error, results, fields) {
            if (error) {
              res.status(500).send({error: `Database query failed, error message: ${error}`});
            } else {
              res.status(200).send(results);
            }
          }
        );
      } else {
        res.status(401).send({error: `Access denied`});
      }
    }
  );
});

router.post('/:customerId/xml', function(req, res, next) {
  const contacts = req.body.contactsXml;
  const parsedXml = libxmljs.parseXmlString(contacts, libxmlParseOptions);
  const content = parsedXml.find('//contacts/contact');
  const customerId = req.params.customerId;

  const contactObjects = content.map(el => ({
    'name': el.get('name').text(),
    'iban': el.get('iban').text()
  }));

  res.locals.connection.query('DELETE FROM contacts WHERE customer_id = ?', [customerId], 
    function (error, results, fields) {
      if (error) {
        res.status(500).send({error: `Database query failed, error message: ${error}`});
      } else {
        const insert = contactObjects
          .map(obj => `INSERT INTO contacts (\`name\`, \`iban\`, \`customer_id\`)
          VALUES (
            "${obj.name.replace(/\n/g, '')}",
            "${obj.iban.replace(/\n/g, '')}",
            ${req.params.customerId}
          )`)
          .join('; \n');

//        console.log(insert);

        res.locals.connection.query(insert, function (error, results) {
          if (error) {
            res.status(500).send({error: "Database query failed, error message: " + error});
          } else {
            res.status(200).send(contactObjects);
          }
        });
      }
    }
  );
});

module.exports = router;
