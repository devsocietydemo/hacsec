var { ACCOUNT_NUMBER, UNAUTHORIZED_ACCOUNT_NUMBER, URL, 
  TRANSACTIONS_URI, METHOD_GET, validateHealthCheck, 
  expectAccessDenied, ensureURLDoesNotExist, logInUser, logOutUser } = require('./common');

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

describe('Transactions API', function() {

  before('Validate system healthcheck', function() {
    return validateHealthCheck(chai);
  })

  describe(`${TRANSACTIONS_URI} GET`, function() {
    it('Should fail when trying to invoke GET on transactions path', function() {
      return ensureURLDoesNotExist(chai, TRANSACTIONS_URI, METHOD_GET);
    })
  })

  describe(`${TRANSACTIONS_URI} POST`, function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Should create new transaction correctly when valid session is used', function() {
      return chai.request(URL).post(TRANSACTIONS_URI)
        .send({account_id:ACCOUNT_NUMBER, amount:10.49, description:'Test transaction', target_iban:'PL12 3456 7890'})
        .set('sessionid', currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
        });
    })

    it('Should not create new transaction to unauthorized account', function() {
      return chai.request(URL).post(TRANSACTIONS_URI)
        .send({account_id:UNAUTHORIZED_ACCOUNT_NUMBER, amount:10.49, description:'Test transaction', target_iban:'PL12 3456 7890'})
        .set('sessionid', currentSessionId)
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should not create new transaction when invalid session is used', function() {
      return chai.request(URL).post(TRANSACTIONS_URI)
        .send({account_id:ACCOUNT_NUMBER, amount:10.49, description:'Test transaction', target_iban:'PL12 3456 7890'})
        .set('sessionid', 'invalid')
        .then(response => expectAccessDenied(chai, response));
    })
  })
})