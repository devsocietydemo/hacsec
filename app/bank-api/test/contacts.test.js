var { USERNAME, UNAUTHORIZED_USERNAME, VALID_PASSWORD, URL } = require('./common');

var chakram = require('chakram');
var expect = chakram.expect;

describe('Contacts API', function() {

  before('Validate system healthcheck', function() {
    return chakram.get(`${URL}/api/v1/health`)
      .then( response => { 
        expect(response).to.have.status(200)
        expect(response).to.comprise.of.json({status:'OK'});
      })
  })

  describe('api/v1/contacts GET', function() {
    it('Should fail when trying to invoke GET on contacts path', function() {
      var response=chakram.get(`${URL}/api/v1/contacts`);
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  })

  describe('api/v1/contacts POST', function() {
    it('Should fail when trying to invoke POST on contacts path', function() {
      var response=chakram.post(`${URL}/api/v1/contacts`, {});
      expect(response).to.have.status(404);    
      return chakram.wait();
    })
  })

  describe('api/v1/contacts/{id} GET', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Should list customer contacts correctly when valid session is used', function() {
      var response=chakram.get(`${URL}/api/v1/contacts/${USERNAME}`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      expect(response).to.have.json( json => {
        expect(json).to.be.array;
      })
      return chakram.wait();
    })

    it('Should not list customer contacts when unathorized user is used', function() {
      var response=chakram.get(`${URL}/api/v1/contacts/${UNAUTHORIZED_USERNAME}`, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })

    it('Should fail when session id is not provided', function() {
      var response=chakram.get(`${URL}/api/v1/contacts/${USERNAME}`);
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })
  })

  describe('api/v1/contacts/{id} POST', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Should create new contact correctly when valid session is used', function() {
      var response=chakram.post(`${URL}/api/v1/contacts/${USERNAME}`, {name:'Test contact', iban:'PL12 3456 7890'}, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      return chakram.wait();
    })

    it('Should not create new contact when unathorized user is used', function() {
      var response=chakram.post(`${URL}/api/v1/contacts/${UNAUTHORIZED_USERNAME}`, {name:'Test contact', iban:'PL12 3456 7890'}, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })

    it('Should fail when session id is not provided', function() {
      var response=chakram.post(`${URL}/api/v1/contacts/${USERNAME}`, {name:'Test contact', iban:'PL12 3456 7890'});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })
  })

  describe('api/v1/contacts/{id}/xml GET', function() {
    it('Should fail when trying to invoke GET on contacts XML path', function() {
      var response=chakram.get(`${URL}/api/v1/contacts/${USERNAME}/xml`);
      expect(response).to.have.status(404);
      return chakram.wait();
    })
  })

  describe('api/v1/contacts/{id}/xml POST', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return chakram.post(`${URL}/api/v1/login`, {id:USERNAME, password:VALID_PASSWORD})
        .then( response => { currentSessionId = response.body.sessionId; return expect(response.body.success).to.be.true})
    })
  
    after('Log out customer to release session', function() {
      return chakram.post(`${URL}/api/v1/logout`, {}, {headers:{sessionid:currentSessionId}})
        .then( response => { return expect(response).to.have.status(200)})
    })

    it('Should import contacts correctly when valid session is used', function() {
      var response=chakram.post(`${URL}/api/v1/contacts/${USERNAME}/xml`, {contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban></contact><contact><name>Business Mike</name><iban>PL99 1234 5678</iban></contact></contacts>'}, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(200);
      return chakram.wait();
    })

    it('Should fail gracefully when importing invalid contacts XML', function() {
      var response=chakram.post(`${URL}/api/v1/contacts/${USERNAME}/xml`, {contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban>'}, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(500);
      expect(response).to.have.json( json => {
        expect(json.error).to.match(/XML parsing failed, message: /);
      })
      return chakram.wait();
    })

    it('Should not delete all contacts when XML parsing fails', function() {
      return chakram.post(`${URL}/api/v1/contacts/${USERNAME}/xml`, {contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban></contact><contact><name>Business Mike</name><iban>PL99 1234 5678</iban></contact></contacts>'}, {headers:{sessionid:currentSessionId}})
        .then( response => {
          expect(response).to.have.status(200);
          return chakram.post(`${URL}/api/v1/contacts/${USERNAME}/xml`, {contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban>'}, {headers:{sessionid:currentSessionId}});
        })
        .then( response => {
          expect(response).to.have.status(500);
          return chakram.get(`${URL}/api/v1/contacts/${USERNAME}`, {headers:{sessionid:currentSessionId}});
        })
        .then( response => {
          expect(response).to.have.status(200);
          expect(response).to.have.json( json => {
            expect(json).to.be.array;
            expect(json).to.have.lengthOf(2);
          })
          return chakram.wait();            
        })
    })

    it('Should not create new contact when unathorized user is used', function() {
      var response=chakram.post(`${URL}/api/v1/contacts/${UNAUTHORIZED_USERNAME}/xml`, {contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban></contact><contact><name>Business Mike</name><iban>PL99 1234 5678</iban></contact></contacts>'}, {headers:{sessionid:currentSessionId}});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })

    it('Should fail when session id is not provided', function() {
      var response=chakram.post(`${URL}/api/v1/contacts/${USERNAME}/xml`, {contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban></contact><contact><name>Business Mike</name><iban>PL99 1234 5678</iban></contact></contacts>'});
      expect(response).to.have.status(401);
      expect(response).to.comprise.of.json({error: 'Access denied'});
      return chakram.wait();
    })

    it('Should not allow XXE to extract /etc/passwd file', function() {
      return chakram.post(`${URL}/api/v1/contacts/${USERNAME}/xml`, {contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><!DOCTYPE foo [<!ELEMENT foo ANY ><!ENTITY bar SYSTEM "file:///etc/passwd" >]><contacts><contact><name>Business Mike</name><iban>&bar;</iban></contact></contacts>'}, {headers:{sessionid:currentSessionId}})
        .then( result => {
          expect(result).to.have.status(200);
          var response=chakram.get(`${URL}/api/v1/contacts/${USERNAME}`, {headers:{sessionid:currentSessionId}});
          expect(response).to.have.status(200);
          expect(response).to.have.json( json => {
            expect(json).to.be.array;
            expect(json[0].iban).to.not.match(/node:x:1000:1000::\/home\/node:\/bin\/bash/);
          })
          return chakram.wait();
        })
    })
  })
})