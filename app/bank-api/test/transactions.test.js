var { USERNAME, ACCOUNT_NUMBER, UNAUTHORIZED_ACCOUNT_NUMBER, VALID_PASSWORD, URL } = require('./common');

var chakram = require('chakram');
var expect = chakram.expect;

describe('Transactions API', function() {

  before('Validate system healthcheck', function() {
    return chakram.get(`${URL}/api/v1/health`)
      .then( response => { 
        expect(response).to.have.status(200)
        expect(response).to.comprise.of.json({status:'OK'});
      })
  })

  describe('api/v1/transactions GET', function() {
    it('Should fail when trying to invoke GET on transactions path', function() {
      var response=chakram.get(`${URL}/api/v1/transactions`);
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  })

  describe('api/v1/transactions POST', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Should create new transaction correctly when valid session is used', function() {
      var response=chakram.post(`${URL}/api/v1/transactions`, {account_id:ACCOUNT_NUMBER, amount:10.49, description:'Test transaction', target_iban:'PL12 3456 7890'} , {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      return chakram.wait();
    })

    it('Should not create new transaction to unauthorized account', function() {
      var response=chakram.post(`${URL}/api/v1/transactions`, {account_id:UNAUTHORIZED_ACCOUNT_NUMBER, amount:10.49, description:'Test transaction', target_iban:'PL12 3456 7890'} , {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })

    it('Should not create new transaction when invalid session is used', function() {
      var response=chakram.post(`${URL}/api/v1/transactions`, {account_id:ACCOUNT_NUMBER, amount:10.49, description:'Test transaction', target_iban:'PL12 3456 7890'} , {headers:{sessionid:'invalid'}});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })
  })
})