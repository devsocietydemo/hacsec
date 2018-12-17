var express = require('express');

var { getAllCustomerContacts, addCustomerContact, replaceCustomerContacts } = require('../common/db/contacts');
var { validateCustomerSession } = require('../common/redis/sessions')
var { parseContactsXml } = require('../common/xml/contacts');
var { STANDARD_ACCESS_DENIED_ERROR } = require('../common/app/errors');
var { checkIfSessionExists, sendCorrectResult, sendErrorMessage, formatFileForDownload } = require('../common/http/handler')

var router = express.Router();

router.get('/:customerId', function(req, res) {
  const customerId = req.params.customerId;
  const sessionId = req.headers.sessionid;
  checkIfSessionExists(sessionId)
    .then( sessionId => validateCustomerSession(res.locals.redisClient, sessionId, customerId))
    .then( success => success ? getAllCustomerContacts(res.locals.driver, customerId) : Promise.reject(STANDARD_ACCESS_DENIED_ERROR))
    .then( results => sendCorrectResult(res, results) )
    .catch( error => sendErrorMessage(res, error) );
});

router.post('/:customerId', function(req, res) {
  const {name, iban} = req.body;
  const customerId = req.params.customerId;
  const sessionId = req.headers.sessionid;
  checkIfSessionExists(sessionId)
    .then( sessionId => validateCustomerSession(res.locals.redisClient, sessionId, customerId))
    .then( success => success ? addCustomerContact(res.locals.driver, customerId, name, iban) : Promise.reject(STANDARD_ACCESS_DENIED_ERROR))
    .then( results => sendCorrectResult(res, results) )
    .catch( error => sendErrorMessage(res, error) )
});

router.post('/:customerId/xml', function(req, res) {
  const sessionId = req.headers.sessionid;
  const customerId = req.params.customerId;
  const contactsXml = req.body.contactsXml;
  checkIfSessionExists(sessionId)
    .then( sessionId => validateCustomerSession(res.locals.redisClient, sessionId, customerId))
    .then( success => success ? parseContactsXml(contactsXml) : Promise.reject(STANDARD_ACCESS_DENIED_ERROR))
    .then( contacts => replaceCustomerContacts(res.locals.driver, customerId, contacts))
    .then( contacts => sendCorrectResult(res, contacts))
    .catch( error => sendErrorMessage(res, error))
});

router.get('/:customerId/download', function(req, res) {
  const customerId = req.params.customerId;
  const sessionId = req.headers.sessionid;
  checkIfSessionExists(sessionId)
    .then( sessionId => validateCustomerSession(res.locals.redisClient, sessionId, customerId))
    .then( success => success ? getAllCustomerContacts(res.locals.driver, customerId) : Promise.reject(STANDARD_ACCESS_DENIED_ERROR))
    .then( results => formatFileForDownload(results, res) )
    .catch( error => sendErrorMessage(res, error) );
});

module.exports = router;
