const runCustomersAPITests = function(chai, config) {

  var { USERNAME, UNAUTHORIZED_USERNAME, WEAK_PASSWORD_HASH, URL, 
      CUSTOMERS_URI, METHOD_GET, METHOD_POST, validateHealthCheck, 
      expectAccessDenied, ensureURLDoesNotExist, logInUser, logOutUser } = config;
var expect = chai.expect;

describe('Customers API', function() {

  before('Validate system healthcheck', function() {
    return validateHealthCheck(chai);
  })
 
  describe(`${CUSTOMERS_URI} GET`, function() {
    it('Should fail when trying to invoke GET on customers path', function() {
      return ensureURLDoesNotExist(chai, CUSTOMERS_URI, METHOD_GET)
    })
  })

  describe(`${CUSTOMERS_URI} POST`, function() {
    it('Should fail when trying to invoke POST on customers path', function() {
      return ensureURLDoesNotExist(chai, CUSTOMERS_URI, METHOD_POST)
    })
  })

  describe(`${CUSTOMERS_URI}/{id} GET`, function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Should list customer data correctly when valid session is used', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME}`)
        .set('sessionid',currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.lengthOf(1);
          expect(response.body[0].id).to.be.equal(USERNAME);
          expect(response.body[0].name).not.to.be.null;
          expect(response.body[0].nationality).not.to.be.null;
          expect(response.body[0].salt).not.to.be.null;
          expect(response.body[0].password).not.to.be.null;
        })
    })

    it('Application should not use weak password hashing', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME}`)
        .set('sessionid',currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.lengthOf(1);
          expect(response.body[0].password).not.to.be.equal(WEAK_PASSWORD_HASH);
        })
    })

    it('Should not list all customer data when SQL injection is used', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME} or 1=1`)
        .set('sessionid',currentSessionId)
        .then(response => {
          if (response.statusCode === 200) {
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(1);
            expect(response.body[0].id).to.be.equal(USERNAME);
            expect(response.body[0].name).not.to.be.null;
            expect(response.body[0].nationality).not.to.be.null;
            expect(response.body[0].salt).not.to.be.null;
            expect(response.body[0].password).not.to.be.null;
          } else { 
            return expectAccessDenied(chai, response);
          }
        })
    })

    it('Should not allow to run multiple queries when SQL injection is used', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME};SELECT * FROM accounts;`)
        .set('sessionid',currentSessionId)
        .then(response => expect(response.status).to.be.oneOf([401, 500]));
    })

    it('Should not list customer data when unathorized user is used', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${UNAUTHORIZED_USERNAME}`)
        .set('sessionid',currentSessionId)
        .then(response => expectAccessDenied(chai, response))
    })

    it('Should fail when session id is not provided', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME}`)
        .then(response => expectAccessDenied(chai, response));
    })
  })

  describe(`${CUSTOMERS_URI}/{id} POST`, function() {
    it('Should fail when trying to invoke POST on customers path', function() {
      return ensureURLDoesNotExist(chai, `${CUSTOMERS_URI}/${USERNAME}`, METHOD_POST);
    })
  })

  describe(`${CUSTOMERS_URI}/{id}/accounts GET`, function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Should fail when session id is not provided', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME}/accounts`)
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should list customer accounts data correctly when valid session is used', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME}/accounts`)
        .set('sessionid', currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.lengthOf(3);
          expect(response.body.map(entry=> {return {id:entry.id, iban:entry.iban}})).to.have.deep.members([{id:86433, iban:'PL12 5234 4143 8746 7665'}, {id:86434, iban:'PL13 5127 6900 0411 5593'}, {id:86435, iban:'PL53 5324 1702 1359 0846'}]);
        })
    })

    it('Should not list customer accounts data when unathorized user is used', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${UNAUTHORIZED_USERNAME}/accounts`)
        .set('sessionid', currentSessionId)
        .then(response => expectAccessDenied(chai, response))
    })

    it('Should not allow SQL injection during accounts fetch operation', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME} or 1=1/accounts`)
        .set('sessionid', currentSessionId)
        .then(response => {
          if (response.statusCode === 200) {
            expect(response).to.be.json;
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(3);
            expect(response.body.map(entry=> {return {id:entry.id, iban:entry.iban}})).to.have.deep.members([{id:86433, iban:'PL12 5234 4143 8746 7665'}, {id:86434, iban:'PL13 5127 6900 0411 5593'}, {id:86435, iban:'PL53 5324 1702 1359 0846'}]);
          } else {
            return expectAccessDenied(chai, response);
          }
        })
    })

  })

  describe(`${CUSTOMERS_URI}/{id}/accounts POST`, function() {
    it('Should fail when trying to invoke POST on customers path', function() {
      return ensureURLDoesNotExist(chai, `${CUSTOMERS_URI}/${USERNAME}/accounts`, METHOD_POST);
    })
  })
})
}

module.exports = { runCustomersAPITests };