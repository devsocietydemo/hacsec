const runLoginAPITests = function(chai, config) {
  var { USERNAME, VALID_PASSWORD, INVALID_PASSWORD, URL, LOGIN_URI, 
    SESSIONS_URI, LOGOUT_URI, CUSTOMERS_URI, METHOD_GET, validateHealthCheck, 
    expectAccessDenied, ensureURLDoesNotExist } = config;
 
var expect = chai.expect;

describe('Login API', function() {
 
  before('Validate system healthcheck', function() {
    return validateHealthCheck(chai, config);
  })
 
  describe(`${LOGIN_URI} POST`, function() {
 
    it('Should allow login with correct user and password', function() {
      return chai.request(URL).post(LOGIN_URI)
        .send({id:USERNAME, password:VALID_PASSWORD})
        .then( response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body.success).to.be.true;
          expect(response.body.sessionId).not.to.be.empty;
        });
    });
 
    it('Should not allow login with incorrect password', function() {
      return chai.request(URL).post(LOGIN_URI)
        .send({id:USERNAME, password:INVALID_PASSWORD})
        .then( response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body.success).to.be.false;
          expect(response.body.sessionId).to.be.null;
      })
    });
  });

  describe(`${LOGIN_URI} GET`, function() {

    it('Should fail when trying to invoke GET on login path', function() {
      return ensureURLDoesNotExist(chai, config, LOGIN_URI, METHOD_GET)
    })
  });

  describe(`${SESSIONS_URI} GET`, function() {
    it('Should fail when trying to list all existing sessions', function() {
      return ensureURLDoesNotExist(chai, config, SESSIONS_URI, METHOD_GET)
    })
  })

  describe(`${LOGOUT_URI} POST`, function() {
    it('Should work correctly with valid session id provided', function() {
      return chai.request(URL).post(LOGIN_URI)
        .send({id:USERNAME, password:VALID_PASSWORD})
        .then(result => {
          return chai.request(URL).post(LOGOUT_URI, {})
            .set('sessionid', result.body.sessionId)})
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body.success).to.be.true;
        })
    })

    it('Should work correctly with invalid session id provided', function() {
      return chai.request(URL).post(LOGOUT_URI, {})
        .set('sessionid', 'invalid')
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body.success).to.be.false;
        })
    })

    it('Should fail when trying to log out without session id', function() {
      return chai.request(URL).post(LOGOUT_URI, {})
        .then(response => expectAccessDenied(chai, response));
    })

    it('Logout should invalidate session correctly', function() {
      var storedSessionId;
      return chai.request(URL).post(LOGIN_URI)
        .send({id:USERNAME, password:VALID_PASSWORD})
        .then(result => {
          storedSessionId = result.body.sessionId;
          return chai.request(URL).post(LOGOUT_URI, {})
            .set('sessionid', result.body.sessionId)
        })
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body.success).to.be.true;
        })
        .then( () => {
          return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME}/accounts`)
            .set('sessionId', storedSessionId);         
        })
        .then(response => expectAccessDenied(chai, response))
    })
  })

  describe(`${LOGOUT_URI} GET`, function() {
    it('Should fail when trying to invoke GET on logout path', function() {
      return ensureURLDoesNotExist(chai, config, LOGOUT_URI, METHOD_GET);
    })
  });
})
};

module.exports = { runLoginAPITests };