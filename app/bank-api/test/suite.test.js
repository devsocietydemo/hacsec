var config = require('./common');
var { runLoginAPITests } = require('./tests/login.test')
var { runCustomersAPITests } = require('./tests/customers.test');
var { runAccountsAPITests } = require('./tests/accounts.test');
var { runTransactionsAPITests } = require('./tests/transactions.test');
var { runContactsAPITests } = require('./tests/contacts.test');
var { runConfigurationTests } = require('./tests/configuration.test');
var { runAttacksTests } = require('./tests/attacks.test');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

if (process.env.API_HOST_URL) {
  config.URL = process.env.API_HOST_URL;
}

runLoginAPITests(chai, config);
runCustomersAPITests(chai, config);
runAccountsAPITests(chai, config);
runTransactionsAPITests(chai, config);
runContactsAPITests(chai, config);
runConfigurationTests(chai, config);
runAttacksTests(chai, config);
