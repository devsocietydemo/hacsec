var stream = require('stream');
const { REDIS_ERROR_CODES } = require('../redis/errors');
const { MYSQL_ERROR_CODES } = require('../db/errors');
const { XML_ERROR_CODES } = require('../xml/errors');
const { APP_ERROR_CODES, STANDARD_ACCESS_DENIED_ERROR } = require('../app/errors');

const HTTP_OK = 200;
const HTTP_INTERNAL_SERVER_ERROR = 500;
const HTTP_FORBIDDEN = 401

const mapSystemErrorCodesToHttpCodes = function(errorCode) {
  switch (errorCode) {
    case REDIS_ERROR_CODES.SESSION_INIT_FAILED:
    case REDIS_ERROR_CODES.UID_GENERATE_FAILED:
    case REDIS_ERROR_CODES.REDIS_QUERY_FAILED:
    case REDIS_ERROR_CODES.SESSION_DESTROY_FAILED:
    case MYSQL_ERROR_CODES.MYSQL_QUERY_FAILED:
    case XML_ERROR_CODES.XML_PARSE_FAILED:
      return HTTP_INTERNAL_SERVER_ERROR;
    case APP_ERROR_CODES.APP_ACCESS_DENIED:
      return HTTP_FORBIDDEN;
    default:
      throw (`Unhandled error code passed: ${errorCode}`); 
  }
}

const checkIfSessionExists = function(sessionId) {
  if (sessionId && sessionId !== '') {
    return Promise.resolve(sessionId);
  } else {
    return Promise.reject(STANDARD_ACCESS_DENIED_ERROR);
  }
}

const sendCorrectResult = function(response, result) {
  response.status(HTTP_OK).send(result);
}

const sendErrorMessage = function(response, result) {
  if (result) {
    try {
      var httpCode = mapSystemErrorCodesToHttpCodes(result.code)
      response.status(httpCode).send({error:result.message});
    } catch (error) {
      response.status(HTTP_INTERNAL_SERVER_ERROR).send({error: `Translation to error code failed: ${error}, original message: ${result.message}`})
    }
  } else {
    response.status(HTTP_INTERNAL_SERVER_ERROR).send({error:'No error details message provided'});
  }
}

const formatFileForDownload = function(results, res) {

  const reducer = (acc, currentEntry) =>  acc + currentEntry;
  const mappedData = results.map(entry => `<contact><name>${entry.name}</name><iban>${entry.iban}</iban></contact>`);

  const fileName = 'contacts.xml';
  const fileData = mappedData.reduce(reducer, '<?xml version="1.0" encoding="ISO-8859-1"?><contacts>') + '</contacts>';

  var fileContents = Buffer.from(fileData);

  var readStream = new stream.PassThrough();
  readStream.end(fileContents);

  res.set('Content-disposition', 'attachment; filename=' + fileName);
  res.set('Content-Type', 'text/xml');

  readStream.pipe(res);
}

module.exports = { checkIfSessionExists, sendCorrectResult, sendErrorMessage, formatFileForDownload }