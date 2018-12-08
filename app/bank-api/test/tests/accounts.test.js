const runAccountsAPITests = function(chai, config) {

var { ACCOUNT_NUMBER, UNAUTHORIZED_ACCOUNT_NUMBER, URL, 
      ACCOUNTS_URI, METHOD_GET, METHOD_POST, validateHealthCheck, 
      expectAccessDenied, ensureURLDoesNotExist, logInUser, logOutUser } = config;

var expect = chai.expect;

describe('Accounts API', function() {

  before('Validate system healthcheck', function() {
    return validateHealthCheck(chai);
  })

  describe(`${ACCOUNTS_URI} GET`, function() {
    it('Should fail when trying to invoke GET on accounts path', function() {
      return ensureURLDoesNotExist(chai, ACCOUNTS_URI, METHOD_GET);
    })
  })

  describe(`${ACCOUNTS_URI} POST`, function() {
    it('Should fail when trying to invoke POST on accounts path', function() {
      return ensureURLDoesNotExist(chai, ACCOUNTS_URI, METHOD_POST);
    })
  })

  describe(`${ACCOUNTS_URI}/{id} GET`, function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Should list account data correctly when valid session is used', function() {
      return chai.request(URL).get(`${ACCOUNTS_URI}/${ACCOUNT_NUMBER}`)
        .set('sessionid', currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.lengthOf(1);
          expect(response.body[0]).to.not.be.null;
          expect(response.body[0].id).to.be.equal(ACCOUNT_NUMBER);
          expect(response.body[0].iban).to.be.equal('PL12 5234 4143 8746 7665');
          expect(response.body[0].balance).to.not.be.null;
          expect(response.body[0].currency).to.not.be.null;
          expect(response.body[0].account_name).to.not.be.null;
  
        })
    })

    it('Should not list account data when invalid session is used', function() {
      return chai.request(URL).get(`${ACCOUNTS_URI}/${ACCOUNT_NUMBER}`)
        .set('sessionid', 'invalid')
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should not list account data for unauthorized account number', function() {
      return chai.request(URL).get(`${ACCOUNTS_URI}/${UNAUTHORIZED_ACCOUNT_NUMBER}`)
        .set('sessionid', currentSessionId)
        .then(response => expectAccessDenied(chai, response));
    })
  })

  describe(`${ACCOUNTS_URI}/{id} POST`, function() {
    it('Should fail when trying to invoke POST on accounts path', function() {
      return ensureURLDoesNotExist(chai, `${ACCOUNTS_URI}/${ACCOUNT_NUMBER}`, METHOD_POST);
    })
  })

  describe(`${ACCOUNTS_URI}/{id}/transactions GET`, function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Should list account transactions data correctly when valid session is used', function() {
      return chai.request(URL).get(`${ACCOUNTS_URI}/${ACCOUNT_NUMBER}/transactions`)
        .set('sessionid', currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body[0]).to.not.be.null;
          expect(response.body[0].id).to.not.be.null;
          expect(response.body[0].transaction_date).to.not.be.null;
          expect(response.body[0].amount).to.not.be.null;
          expect(response.body[0].description).to.not.be.null;
        })
    })

    it('Should not list account transactions data when invalid session is used', function() {
      return chai.request(URL).get(`${ACCOUNTS_URI}/${ACCOUNT_NUMBER}/transactions`)
        .set('sessionid', 'invalid')
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should not list account transactions data for unauthorized account number', function() {
      return chai.request(URL).get(`${ACCOUNTS_URI}/${UNAUTHORIZED_ACCOUNT_NUMBER}/transactions`)
        .set('sessionid', currentSessionId)
        .then(response => expectAccessDenied(chai, response));
    })
  })

  describe('api/v1/accounts/{id}/transactions POST', function() {
    it('Should fail when trying to invoke POST on accounts path', function() {
      return ensureURLDoesNotExist(chai, `${ACCOUNTS_URI}/${ACCOUNT_NUMBER}/transactions`, METHOD_POST);
    })
  })

})
}

module.exports = { runAccountsAPITests };