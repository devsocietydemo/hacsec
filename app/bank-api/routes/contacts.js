var express = require('express');

var { getAllCustomerContacts, addCustomerContact, replaceCustomerContacts } = require('../common/db/contacts');
var { validateCustomerSession } = require('../common/redis/sessions')
var { parseContactsXml } = require('../common/xml/contacts');
var { STANDARD_ACCESS_DENIED_ERROR } = require('../common/app/errors');
var { sendCorrectResult, sendErrorMessage } = require('../common/http/handler')

var router = express.Router();

router.get('/:customerId', function(req, res) {
  const customerId = req.params.customerId;
  const sessionId = req.headers.sessionid;
  if (sessionId) {
    validateCustomerSession(res.locals.redisClient, sessionId, customerId)
      .then( success => success ? getAllCustomerContacts(res.locals.connection, customerId) : Promise.reject(STANDARD_ACCESS_DENIED_ERROR))
      .then( results => sendCorrectResult(res, results) )
      .catch( error => sendErrorMessage(res, error) );
  } else {
    sendErrorMessage(res, STANDARD_ACCESS_DENIED_ERROR);
  }
});

router.post('/:customerId', function(req, res) {
  const {name, iban} = req.body;
  const customerId = req.params.customerId;
  const sessionId = req.headers.sessionid;
  if (sessionId) {
    validateCustomerSession(res.locals.redisClient, sessionId, customerId)
      .then( success => success ? addCustomerContact(res.locals.connection, customerId, name, iban) : Promise.reject(STANDARD_ACCESS_DENIED_ERROR))
      .then( results => sendCorrectResult(res, results) )
      .catch( error => sendErrorMessage(res, error) )
  } else {
    sendErrorMessage(res, STANDARD_ACCESS_DENIED_ERROR);
  }
});

router.post('/:customerId/xml', function(req, res) {
  const sessionId = req.headers.sessionid;
  const customerId = req.params.customerId;
  const contactsXml = req.body.contactsXml;

  if (sessionId) {
    validateCustomerSession(res.locals.redisClient, sessionId, customerId)
      .then( success => success ? parseContactsXml(contactsXml) : Promise.reject(STANDARD_ACCESS_DENIED_ERROR))
      .then( contacts => replaceCustomerContacts(res.locals.connection, customerId, contacts))
      .then( contacts => sendCorrectResult(res, contacts))
      .catch( error => sendErrorMessage(res, error))
  } else {
    sendErrorMessage(res, STANDARD_ACCESS_DENIED_ERROR);
  }

  // validateCustomerSession(res.locals.redisClient, sessionId, customerId, function(error, success) {
  //   if (error) {
  //     res.status(500).send({error: `Session validation failed: ${error}`});
  //   } else if (success) {
  //     const contacts = req.body.contactsXml;
  //     const parsedXml = libxmljs.parseXmlString(contacts, libxmlParseOptions);
  //     const content = parsedXml.find('//contacts/contact');
    
  //     const contactObjects = content.map(el => ({
  //       'name': el.get('name').text(),
  //       'iban': el.get('iban').text()
  //     }));
    
  //     deleteAllCustomerContacts(res.locals.connection, customerId, 
  //       function (error) {
  //         if (error) {
  //           res.status(500).send({error: `${error}`});
  //         } else {
  //           const insert = contactObjects
  //             .map(obj => new Promise( function(resolve, reject) {
  //               addCustomerContact(res.locals.connection, 
  //                                  req.params.customerId,
  //                                  `${obj.name.replace(/\n/g, '')}`,
  //                                  `${obj.iban.replace(/\n/g, '')}`, 
  //                 function(error, results) {
  //                   if (error) {
  //                     reject (error);
  //                   } else {
  //                     resolve (results);
  //                   }
  //                 }
  //               )
  //             }));
  //           Promise.all(insert).then(function() {
  //             res.status(200).send(contactObjects);
  //           }).catch(function(error) {
  //             res.status(500).send({error: `${error}`});
  //           });  
  //         }
  //       }
  //     );
  //   } else {
  //     res.status(401).send({error: `Access denied`});
  //   }
  // });
});

module.exports = router;
