var { USERNAME, UNAUTHORIZED_USERNAME, VALID_PASSWORD, WEAK_PASSWORD_HASH, URL } = require('./common');

var chakram = require('chakram');
var expect = chakram.expect;

describe('Attacks', function() {

  describe('A1:2017 - SQL Injection', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Should list all customers data using SQL injection', function() {
      var response=chakram.get(`${URL}/api/v1/customers/${USERNAME} or 1=1`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      expect(response).to.have.json( json => {
        expect(json).to.be.array;
        expect(json.length).to.be.equal(4);
        expect(json.map(entry=> {return {id:entry.id}})).to.have.deep.members([{id:2241}, {id:2242}, {id:2243}, {id:2244}]);
      })
      return chakram.wait();
    })
  })

  describe('A2:2017 - Broken Authentication', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    it('Logout should not invalidate session', function() {
        return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
          .then( () => {
            var response=chakram.get(`${URL}/api/v1/customers/${USERNAME}`, {headers:{sessionid:currentSessionId}});
            expect(response).to.have.status(200);
            expect(response).to.have.json( json => {
              expect(json).to.be.array;
              expect(json.length).to.be.equal(1);
              expect(json[0]).to.not.be.null;
              expect(json[0].id).to.be.equal(USERNAME);
              expect(json[0].name).to.not.be.null;
              expect(json[0].nationality).to.not.be.null;
              expect(json[0].salt).to.not.be.null;
              expect(json[0].password).to.not.be.null;
            });
          return chakram.wait();
          })
    })

  })

  describe('A3:2017 - Sensitive Data Exposure', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Application should use weak password hashing', function() {
      var response=chakram.get(`${URL}/api/v1/customers/${USERNAME}`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      expect(response).to.have.json( json => {
        expect(json).to.be.array;
        expect(json.length).to.be.equal(1);
        expect(json[0].password).to.be.equal(WEAK_PASSWORD_HASH);
      })
      return chakram.wait();
    })
  })

  describe('A5:2017 - Broken Access Control', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Should allow access to customer data when unathorized user is used', function() {
      var response=chakram.get(`${URL}/api/v1/customers/${UNAUTHORIZED_USERNAME}`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      expect(response).to.have.json( json => {
        expect(json).to.be.array;
        expect(json.length).to.be.equal(1);
        expect(json[0]).to.not.be.null;
        expect(json[0].id).to.be.equal(UNAUTHORIZED_USERNAME);
        expect(json[0].name).to.not.be.null;
        expect(json[0].nationality).to.not.be.null;
        expect(json[0].salt).to.not.be.null;
        expect(json[0].password).to.not.be.null;
      })
      return chakram.wait();
    })
  })
})