const USERNAME = 2241;
const ACCOUNT_NUMBER = 86433;
const UNAUTHORIZED_USERNAME = 2242;
const UNAUTHORIZED_ACCOUNT_NUMBER = 86436;
const VALID_PASSWORD = 'password';
const INVALID_PASSWORD = 'incorrect';
const WEAK_PASSWORD_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
var URL = 'http://localhost';

const HEALTH_URI = '/api/v1/health';
const LOGIN_URI = '/api/v1/login';
const SESSIONS_URI = `${LOGIN_URI}/sessions`
const LOGOUT_URI = '/api/v1/logout'
const CUSTOMERS_URI = '/api/v1/customers';
const ACCOUNTS_URI = '/api/v1/accounts';
const TRANSACTIONS_URI = '/api/v1/transactions';
const CONTACTS_URI = '/api/v1/contacts';
const ADMINER_URI = '/adminer';
const CDN_URI = '/cdn';

const METHOD_GET = 'GET';
const METHOD_POST = 'POST';

const validateHealthCheck=function(chai) {
  return chai.request(URL).get(HEALTH_URI)
    .then( response => {
      chai.expect(response).to.have.status(200)
      chai.expect(response).to.be.json;
      chai.expect(response.body.status).to.be.equal('OK');
  })
}

const expectAccessDenied=function(chai, response) {
  chai.expect(response).to.have.status(401);
  chai.expect(response.body.error).to.be.equal('Access denied');  
}

const ensureURLDoesNotExist=function(chai, uri, method) {
  var promise;
  switch(method) {
    case METHOD_GET:
      promise=chai.request(URL).get(uri);
      break;
    case METHOD_POST:
      promise=chai.request(URL).post(uri);
      break;
    default:
      throw(`Unknown method passed: ${method}`);
  }
  return promise
    .then (response => {
      chai.expect(response).to.have.status(404);    
    })
}

const logInUser=function(chai) {
  return chai.request(URL).post(LOGIN_URI)
    .send({id:USERNAME, password:VALID_PASSWORD})
    .then( response => {
      chai.expect(response).to.have.status(200);
      chai.expect(response).to.be.json;
      chai.expect(response.body.success).to.be.true;
      chai.expect(response.body.sessionId).not.to.be.empty;
      return response.body.sessionId;
    })
}

const logOutUser=function(chai, sessionId) {
  return chai.request(URL).post(LOGOUT_URI)
    .set('sessionid', sessionId)
    .then(response => {
      chai.expect(response).to.have.status(200);
      chai.expect(response.body.success).to.be.true;
    })
}

module.exports = { USERNAME, 
                   ACCOUNT_NUMBER,
                   UNAUTHORIZED_USERNAME, 
                   UNAUTHORIZED_ACCOUNT_NUMBER,
                   VALID_PASSWORD, 
                   INVALID_PASSWORD, 
                   WEAK_PASSWORD_HASH, 
                   URL,
                   HEALTH_URI,
                   LOGIN_URI,
                   SESSIONS_URI,
                   LOGOUT_URI,
                   CUSTOMERS_URI,
                   ACCOUNTS_URI,
                   TRANSACTIONS_URI,
                   CONTACTS_URI,
                   ADMINER_URI,
                   CDN_URI,
                   METHOD_GET,
                   METHOD_POST,
                   validateHealthCheck,
                   expectAccessDenied,
                   ensureURLDoesNotExist,
                   logInUser,
                   logOutUser }