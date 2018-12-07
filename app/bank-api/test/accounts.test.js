var { USERNAME, ACCOUNT_NUMBER, VALID_PASSWORD, UNAUTHORIZED_ACCOUNT_NUMBER, URL } = require('./common');

var chakram = require('chakram');
var expect = chakram.expect;

describe('Accounts API', function() {

  before('Validate system healthcheck', function() {
    return chakram.get(`${URL}/api/v1/health`)
      .then( response => { 
        expect(response).to.have.status(200)
        expect(response).to.comprise.of.json({status:'OK'});
      })
  })

  describe('api/v1/accounts GET', function() {
    it('Should fail when trying to invoke GET on accounts path', function() {
      var response=chakram.get(`${URL}/api/v1/accounts`);
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  })

  describe('api/v1/accounts POST', function() {
    it('Should fail when trying to invoke POST on customers path', function() {
      var response=chakram.post(`${URL}/api/v1/accounts`, {});
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  })

  describe('api/v1/accounts/{id} GET', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Should list account data correctly when valid session is used', function() {
      var response=chakram.get(`${URL}/api/v1/accounts/${ACCOUNT_NUMBER}`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      expect(response).to.have.json( json => {
        expect(json).to.be.array;
        expect(json).to.have.length(1);
        expect(json[0]).to.not.be.null;
        expect(json[0].id).to.be.equal(ACCOUNT_NUMBER);
        expect(json[0].iban).to.be.equal('PL12 5234 4143 8746 7665');
        expect(json[0].balance).to.not.be.null;
        expect(json[0].currency).to.not.be.null;
        expect(json[0].account_name).to.not.be.null;
      })
      return chakram.wait();
    })

    it('Should not list account data when invalid session is used', function() {
      var response=chakram.get(`${URL}/api/v1/accounts/${ACCOUNT_NUMBER}`, {headers:{sessionid:'invalid'}});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })

    it('Should not list account data for unauthorized account number', function() {
      var response=chakram.get(`${URL}/api/v1/accounts/${UNAUTHORIZED_ACCOUNT_NUMBER}`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })
  })

  describe('api/v1/accounts/{id} POST', function() {
    it('Should fail when trying to invoke POST on accounts path', function() {
      var response=chakram.post(`${URL}/api/v1/accounts/${ACCOUNT_NUMBER}`, {});
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  })

  describe('api/v1/accounts/{id}/transactions GET', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Should list account transactions data correctly when valid session is used', function() {
      var response=chakram.get(`${URL}/api/v1/accounts/${ACCOUNT_NUMBER}/transactions`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      expect(response).to.have.json( json => {
        expect(json).to.be.array;
        expect(json[0]).to.not.be.null;
        expect(json[0].id).to.not.be.null;
        expect(json[0].transaction_date).to.not.be.null;
        expect(json[0].amount).to.not.be.null;
        expect(json[0].description).to.not.be.null;
      })
      return chakram.wait();
    })

    it('Should not list account transactions data when invalid session is used', function() {
      var response=chakram.get(`${URL}/api/v1/accounts/${ACCOUNT_NUMBER}/transactions`, {headers:{sessionid:'invalid'}});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })

    it('Should not list account transactions data for unauthorized account number', function() {
      var response=chakram.get(`${URL}/api/v1/accounts/${UNAUTHORIZED_ACCOUNT_NUMBER}/transactions`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })
  })

  describe('api/v1/accounts/{id}/transactions POST', function() {
    it('Should fail when trying to invoke POST on accounts path', function() {
      var response=chakram.post(`${URL}/api/v1/accounts/${ACCOUNT_NUMBER}/transactions`, {});
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  })

})