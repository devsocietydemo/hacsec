const runConfigurationTests = function (chai, config) {

  var { URL, ADMINER_URI, CDN_URI, METHOD_GET, METHOD_POST, validateHealthCheck, 
        ensureURLDoesNotExist } = config;

  var expect = chai.expect;

  describe('Configuration', function() {
  
    before('Validate system healthcheck', function() {
      return validateHealthCheck(chai, config);
    })

    it('Should not allow access to MySQL Adminer Console', function() {
      return ensureURLDoesNotExist(chai, config, ADMINER_URI, METHOD_GET)
        .then( () => ensureURLDoesNotExist(chai, config, ADMINER_URI, METHOD_POST))
    })

    it('Should not allow to list CDN directory', function() {
      return chai.request(URL).get(`${CDN_URI}/`)
        .then(response => {
          expect(response).to.have.status(403);
        })
    })

    it('Should not allow access to access.php file', function() {
      return ensureURLDoesNotExist(chai, config, `${CDN_URI}/access.php?${new Date().getTime()}`, METHOD_GET)
    })
  })
}

module.exports = { runConfigurationTests }