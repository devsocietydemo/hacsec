const runContactsAPITests = function(chai, config) {

var { USERNAME, UNAUTHORIZED_USERNAME, URL, 
  CONTACTS_URI, METHOD_GET, METHOD_POST, validateHealthCheck, 
  expectAccessDenied, ensureURLDoesNotExist, logInUser, logOutUser } = config;
var expect = chai.expect;
  
describe('Contacts API', function() {

  before('Validate system healthcheck', function() {
    return validateHealthCheck(chai);
  })

  describe(`${CONTACTS_URI} GET`, function() {
    it('Should fail when trying to invoke GET on contacts path', function() {
      return ensureURLDoesNotExist(chai, CONTACTS_URI, METHOD_GET);
    })
  })

  describe(`${CONTACTS_URI} POST`, function() {
    it('Should fail when trying to invoke POST on contacts path', function() {
      return ensureURLDoesNotExist(chai, CONTACTS_URI, METHOD_POST);
    })
  })

  describe(`${CONTACTS_URI}/{id} GET`, function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Should list customer contacts correctly when valid session is used', function() {
      return chai.request(URL).get(`${CONTACTS_URI}/${USERNAME}`)
        .set('sessionid', currentSessionId)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
        })
    })

    it('Should not list customer contacts when unathorized user is used', function() {
      return chai.request(URL).get(`${CONTACTS_URI}/${UNAUTHORIZED_USERNAME}`)
        .set('sessionid', currentSessionId)
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should fail when invalid session id is provided', function() {
      return chai.request(URL).get(`${CONTACTS_URI}/${USERNAME}`)
        .set('sessionid', 'invalid')
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should fail when session id is not provided', function() {
      return chai.request(URL).get(`${CONTACTS_URI}/${USERNAME}`)
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should not allow SQL Injection', function() {
      return chai.request(URL).get(`${CONTACTS_URI}/${USERNAME} or 1=1`)
        .set('sessionid', currentSessionId)
        .then(response => {
          if (response.statusCode === 200) {
            expect(response).to.be.json;
            expect(response.body).to.be.an('array');
            expect([...new Set(response.body.map(entry => entry.customer_id))]).to.have.members([USERNAME]);
          } else {
            return expectAccessDenied(chai, response);
          }
        })
    })
  })

  describe(`${CONTACTS_URI}/{id} POST`, function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Should create new contact correctly when valid session is used', function() {
      return chai.request(URL).post(`${CONTACTS_URI}/${USERNAME}`)
        .set('sessionid', currentSessionId)
        .send({name:'Test contact', iban:'PL12 3456 7890'})
        .then(response => {
          expect(response).to.have.status(200);
        })
    })

    it('Should not create new contact when unathorized user is used', function() {
      return chai.request(URL).post(`${CONTACTS_URI}/${UNAUTHORIZED_USERNAME}`)
        .set('sessionid', currentSessionId)
        .send({name:'Test contact', iban:'PL12 3456 7890'})
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should fail when session id is not provided', function() {
      return chai.request(URL).post(`${CONTACTS_URI}/${UNAUTHORIZED_USERNAME}`)
        .send({name:'Test contact', iban:'PL12 3456 7890'})
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should fail when invalid session id is provided', function() {
      return chai.request(URL).post(`${CONTACTS_URI}/${USERNAME}`)
        .set('sessionid', 'invalid')
        .send({name:'Test contact', iban:'PL12 3456 7890'})
        .then(response => expectAccessDenied(chai, response));
    })
  })

  describe(`${CONTACTS_URI}/{id}/xml GET`, function() {
    it('Should fail when trying to invoke GET on contacts XML path', function() {
      return ensureURLDoesNotExist(chai, `${CONTACTS_URI}/${USERNAME}/xml`, METHOD_GET);
    })
  })

  describe(`${CONTACTS_URI}/{id}/xml POST`, function() {

    var currentSessionId;

    before('Log in to obtain valid session id', function() {
      return logInUser(chai).then(sessionId => currentSessionId = sessionId);
    })
  
    after('Log out customer to release session', function() {
      return logOutUser(chai, currentSessionId);
    })

    it('Should import contacts correctly when valid session is used', function() {
      return chai.request(URL).post(`${CONTACTS_URI}/${USERNAME}/xml`)
        .set('sessionid', currentSessionId)
        .send({contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban></contact><contact><name>Business Mike</name><iban>PL99 1234 5678</iban></contact></contacts>'})
        .then(response => {
          expect(response).to.have.status(200);
        })
    })

    it('Should fail gracefully when importing invalid contacts XML', function() {
      return chai.request(URL).post(`${CONTACTS_URI}/${USERNAME}/xml`)
        .set('sessionid', currentSessionId)
        .send({contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban>'})
        .then(response => {
          expect(response).to.have.status(500);
          expect(response).to.be.json;
          expect(response.body.error).to.match(/XML parsing failed, message: /);
        })
    })

    it('Should not delete all contacts when XML parsing fails', function() {
      return chai.request(URL).post(`${CONTACTS_URI}/${USERNAME}/xml`)
        .set('sessionid', currentSessionId)
        .send({contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban></contact><contact><name>Business Mike</name><iban>PL99 1234 5678</iban></contact></contacts>'})
        .then(response => {
          expect(response).to.have.status(200);
        })
        .then( () => {
          return chai.request(URL).post(`${CONTACTS_URI}/${USERNAME}/xml`)
          .set('sessionid', currentSessionId)
          .send({contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban>'});
        })
        .then(response => {
          expect(response).to.have.status(500);
          expect(response).to.be.json;
          expect(response.body.error).to.match(/XML parsing failed, message: /);
        })
        .then( () => {
          return chai.request(URL).get(`${CONTACTS_URI}/${USERNAME}`)
          .set('sessionid', currentSessionId);
        })
        .then(response => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.lengthOf(2);
        })
    })

    it('Should not import contacts when unathorized user is used', function() {
      return chai.request(URL).post(`${CONTACTS_URI}/${UNAUTHORIZED_USERNAME}/xml`)
        .set('sessionid', currentSessionId)
        .send({contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban></contact><contact><name>Business Mike</name><iban>PL99 1234 5678</iban></contact></contacts>'})
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should fail when invalid session id is provided', function() {
      return chai.request(URL).post(`${CONTACTS_URI}/${USERNAME}/xml`)
        .set('sessionid', 'invalid')
        .send({contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban></contact><contact><name>Business Mike</name><iban>PL99 1234 5678</iban></contact></contacts>'})
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should fail when session id is not provided', function() {
      return chai.request(URL).post(`${CONTACTS_URI}/${USERNAME}/xml`)
        .send({contactsXml:'<?xml version="1.0" encoding="ISO-8859-1"?><contacts><contact><name>John Doe</name><iban>PL99 1234 1234</iban></contact><contact><name>Business Mike</name><iban>PL99 1234 5678</iban></contact></contacts>'})
        .then(response => expectAccessDenied(chai, response));
    })

    it('Should not allow XXE to extract /etc/passwd file', function() {
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
          expect(response.body[0].iban).to.not.match(/node:x:1000:1000::\/home\/node:\/bin\/bash/);        
        })
    })
  })
})
}

module.exports = { runContactsAPITests };