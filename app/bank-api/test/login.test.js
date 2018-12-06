var { USERNAME, VALID_PASSWORD, INVALID_PASSWORD, URL } = require('./common');
var chakram = require('chakram');
var expect = chakram.expect;

describe('Login API', function() {

  describe('api/v1/login POST', function() {

    it('Should allow login with correct user and password', function() {
      var response=chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD});
      expect(response).to.have.status(200);
      expect(response).to.have.body;
      expect(response).to.have.json( json => {
        expect(json.success).to.be.true;
        expect(json.sessionId).not.to.be.empty;
      });
      return chakram.wait();
    });

    it('Should not allow login with incorrect password', function() {
      var response=chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:INVALID_PASSWORD})
      expect(response).to.have.status(200);
      expect(response).to.comprise.of.json({success:false, sessionId:null});
      return chakram.wait();
    });

  });

  describe('api/v1/login GET', function() {

    it('Should fail when trying to invoke GET on login path', function() {
      var response=chakram.get(`${URL}/api/v1/login`);
      expect(response).to.have.status(404);    
      return chakram.wait();
    })

  });

  describe('api/v1/login/sessions GET', function() {
    it('Should list all the active sessions when session id is provided', function() {
      var response=chakram.get(`${URL}/api/v1/login/sessions`, {headers:{sessionid:'not_empty'}});
      expect(response).to.have.status(200);
      expect(response).to.have.json( json => {
        expect(json).to.be.array;
        expect(json[0]).to.not.be.null;
        expect(json[0].customerId).to.not.be.null;
        expect(json[0].sessions).to.be.array;
        expect(json[0].sessions[0]).to.not.be.null;
      })
      return chakram.wait();
    })

    it('Should fail when trying to list sessions without session id', function() {
      var response=chakram.get(`${URL}/api/v1/login/sessions`);
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })
  })

  describe('api/v1/logout POST', function() {
    it('Should work correctly with valid session id provided', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then(result => {
          var response=chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:result.body.sessionId}});
          expect(response).to.have.status(200);
          expect(response).to.comprise.of.json({success:true});
          return chakram.wait();
        })
    })

    it('Should work correctly with invalid session id provided', function() {
      var response=chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:'invalid'}});
      expect(response).to.have.status(200);
      expect(response).to.comprise.of.json({success:false});
      return chakram.wait();
    })

    it('Should fail when trying to log out without session id', function() {
      var response=chakram.post(`${URL}/api/v1/logout`);
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })

    it('Logout should invalidate session correctly', function() {
      var storedSessionId;
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then(result => {
          storedSessionId = result.body.sessionId;
          var response=chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:result.body.sessionId}});
          expect(response).to.have.status(200);
          return response;          
        })
        .then( () => {
          var response=chakram.get(`${URL}/api/v1/customers/${USERNAME}`, {headers:{sessionid:storedSessionId}});
          expect(response).to.have.status(401);
          expect(response).to.comprise.of.json({error: 'Access denied'});
          return chakram.wait();
        })
    })
  })

  describe('api/v1/logout GET', function() {
    it('Should fail when trying to invoke GET on logout path', function() {
      var response=chakram.get(`${URL}/api/v1/logout`);
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  });
});