var express = require('express');
var libxmljs = require('libxmljs');
var { getAllCustomerContacts, addCustomerContact, deleteAllCustomerContacts } = require('../common/db/contacts');
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
        getAllCustomerContacts(res.locals.connection, customerId, 
          function (error, results) {
            if (error) {
              res.status(500).send({error: `${error}`});
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
        addCustomerContact(res.locals.connection, customerId, name, iban, 
          function (error, results) {
            if (error) {
              res.status(500).send({error: `${error}`});
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

  deleteAllCustomerContacts(res.locals.connection, customerId, 
    function (error) {
      if (error) {
        res.status(500).send({error: `${error}`});
      } else {
        const insert = contactObjects
          .map(obj => new Promise( function(resolve, reject) {
            addCustomerContact(res.locals.connection, 
                               req.params.customerId,
                               `${obj.name.replace(/\n/g, '')}`,
                               `${obj.iban.replace(/\n/g, '')}`, 
              function(error, results) {
                if (error) {
                  reject (error);
                } else {
                  resolve (results);
                }
              }
            )
          }));
        Promise.all(insert).then(function() {
          res.status(200).send(contactObjects);
        }).catch(function(error) {
          res.status(500).send({error: `${error}`});
        });  
      }
    }
  );
});

module.exports = router;
