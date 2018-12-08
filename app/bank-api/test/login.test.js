var { USERNAME, VALID_PASSWORD, INVALID_PASSWORD, URL, HEALTH_URI, 
      LOGIN_URI, SESSIONS_URI, LOGOUT_URI, CUSTOMERS_URI } = require('./common');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

describe('Login API', function() {
 
  before('Validate system healthcheck', function() {
    return chai.request(URL).get(HEALTH_URI)
      .then( response => {
        expect(response).to.have.status(200)
        expect(response).to.be.json;
        expect(response.body.status).to.be.equal('OK');
      })
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
      return chai.request(URL).get(LOGIN_URI)
        .then (response => {
          expect(response).to.have.status(404);    
        })
    })

  });

  describe(`${SESSIONS_URI} GET`, function() {
    it('Should list all the active sessions when session id is provided', function() {
      return chai.request(URL).get(SESSIONS_URI).set('sessionid','not_empty')
        .then (response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body[0]).not.to.be.null;
          expect(response.body[0].customerId).not.to.be.null;
          expect(response.body[0].sessions).to.be.an('array');
          expect(response.body[0].sessions).not.to.be.null;
        })
    })

    it('Should fail when trying to list sessions without session id', function() {
      return chai.request(URL).get(SESSIONS_URI)
        .then(response => {
          expect(response).to.have.status(401);
          expect(response.body.error).to.be.equal('Access denied');
        })
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
        .then(response => {
          expect(response).to.have.status(401);
          expect(response.body.error).to.be.equal('Access denied');
        })
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
        .then( response => {
          expect(response).to.have.status(401);
          expect(response.body.error).to.be.equal('Access denied');
        })
    })
  })

  describe('api/v1/logout GET', function() {
    it('Should fail when trying to invoke GET on logout path', function() {
      return chai.request(URL).get(LOGOUT_URI)
        .then(response => {
          expect(response).to.have.status(404);
        })
    })
  });
})