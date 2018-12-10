const runTransactionsAPITests = function(chai, config) {

var { ACCOUNT_NUMBER, UNAUTHORIZED_ACCOUNT_NUMBER, URL, ACCOUNTS_URI, 
  TRANSACTIONS_URI, METHOD_GET, validateHealthCheck, 
  expectAccessDenied, ensureURLDoesNotExist, logInUser, logOutUser } = config;

var expect = chai.expect;

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

    it('Should sanitize HTML correctly to prevent XSS', function() {
      return chai.request(URL).post(TRANSACTIONS_URI)
        .send({account_id:ACCOUNT_NUMBER, amount:10.49, description:'<a href="http://localhost:8005/page">More details...</a>', target_iban:'PL12 3456 7890'})
        .set('sessionid', currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
          return chai.request(URL).get(`${ACCOUNTS_URI}/${ACCOUNT_NUMBER}/transactions`)
           .set('sessionid', currentSessionId)
        })
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body.map(entry => entry.description)).to.not.include('<a href="http://localhost:8005/page">More details...</a>');
        })
    })
  })
})
}

module.exports = { runTransactionsAPITests };