var { USERNAME, UNAUTHORIZED_USERNAME, VALID_PASSWORD, WEAK_PASSWORD_HASH, URL } = require('./common');

var chakram = require('chakram');
var expect = chakram.expect;

describe('Customers API', function() {

  describe('api/v1/customers GET', function() {
    it('Should fail when trying to invoke GET on customers path', function() {
      var response=chakram.get(`${URL}/api/v1/customers`);
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  })

  describe('api/v1/customers POST', function() {
    it('Should fail when trying to invoke POST on customers path', function() {
      var response=chakram.post(`${URL}/api/v1/customers`, {});
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  })

  describe('api/v1/customers/{id} GET', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Should list customer data correctly when valid session is used', function() {
      var response=chakram.get(`${URL}/api/v1/customers/${USERNAME}`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      expect(response).to.have.json( json => {
        expect(json).to.be.array;
        expect(json).to.have.length(1);
        expect(json[0]).to.not.be.null;
        expect(json[0].id).to.be.equal(USERNAME);
        expect(json[0].name).to.not.be.null;
        expect(json[0].nationality).to.not.be.null;
        expect(json[0].salt).to.not.be.null;
        expect(json[0].password).to.not.be.null;
      })
      return chakram.wait();
    })

    it('Application should not use weak password hashing', function() {
      var response=chakram.get(`${URL}/api/v1/customers/${USERNAME}`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      expect(response).to.have.json( json => {        
        expect(json).to.be.array;
        expect(json.length).to.be.equal(1);
        expect(json[0].password).to.not.be.equal(WEAK_PASSWORD_HASH);
      })
      return chakram.wait();
    })

    it('Should not list all customer data when SQL injection is used', function() {
      var response=chakram.get(`${URL}/api/v1/customers/${USERNAME} or 1=1`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      expect(response).to.have.json( json => {
        expect(json).to.be.array;
        expect(json).to.have.lengthOf(1);
        expect(json[0]).to.not.be.null;
        expect(json[0].id).to.be.equal(USERNAME);
        expect(json[0].name).to.not.be.null;
        expect(json[0].nationality).to.not.be.null;
        expect(json[0].salt).to.not.be.null;
        expect(json[0].password).to.not.be.null;
      })
      return chakram.wait();
    })

    it('Should not list customer data when unathorized user is used', function() {
      var response=chakram.get(`${URL}/api/v1/customers/${UNAUTHORIZED_USERNAME}`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })

    it('Should fail when session id is not provided', function() {
      var response=chakram.get(`${URL}/api/v1/customers/${USERNAME}`);
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })
  })

  describe('api/v1/customers/{id} POST', function() {
    it('Should fail when trying to invoke POST on customers path', function() {
      var response=chakram.post(`${URL}/api/v1/customers/{USERNAME}`, {});
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  })

  describe('api/v1/customers/{id}/accounts GET', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Should fail when session id is not provided', function() {
      var response=chakram.get(`${URL}/api/v1/customers/${USERNAME}/accounts`);
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })

    it('Should list customer accounts data correctly when valid session is used', function() {
      var response=chakram.get(`${URL}/api/v1/customers/${USERNAME}/accounts`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      expect(response).to.have.json( json => {
        expect(json).to.be.array;
        expect(json.length).to.be.equal(3);
        expect(json.map(entry=> {return {id:entry.id, iban:entry.iban}})).to.have.deep.members([{id:86433, iban:'PL12 5234 4143 8746 7665'}, {id:86434, iban:'PL13 5127 6900 0411 5593'}, {id:86435, iban:'PL53 5324 1702 1359 0846'}]);
      })
      return chakram.wait();
    })

    it('Should not list customer accounts data when unathorized user is used', function() {
      var response=chakram.get(`${URL}/api/v1/customers/${UNAUTHORIZED_USERNAME}/accounts`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })
  })

  describe('api/v1/customers/{id}/accounts POST', function() {
    it('Should fail when trying to invoke POST on customers path', function() {
      var response=chakram.post(`${URL}/api/v1/customers/{USERNAME}/accounts`, {});
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  })
})