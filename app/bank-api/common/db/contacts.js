const { MYSQL_ERROR_CODES } = require('./errors');

const getAllCustomerContacts = function(driver, customerId) {
  return new Promise(function(resolve, reject) {
    driver.query('SELECT * from contacts WHERE customer_id = ?', [customerId], 
      function (error, results) {
        if (error) {
          reject({code: MYSQL_ERROR_CODES.MYSQL_QUERY_FAILED, message:`Database query failed, error message: ${error}`});
        } else {
          resolve(results);
        }
      }
    );
  });
}

const addCustomerContact = function(driver, customerId, name, iban) {
  return new Promise(function(resolve, reject) {
    driver.query('INSERT INTO contacts (name, iban, customer_id) VALUES (?, ?, ?)', [name,iban,customerId],
      function (error, results) {
        if (error) {
          reject({code: MYSQL_ERROR_CODES.MYSQL_QUERY_FAILED, message:`Database query failed, error message: ${error}`});
        } else {
          resolve(results);
        }
      }
    );
  });
}

const deleteAllCustomerContacts = function(driver, customerId) {
  return new Promise(function(resolve, reject) {
    driver.query('DELETE FROM contacts WHERE customer_id = ?', [customerId],
      function(error, results) {
        if (error) {
          reject({code: MYSQL_ERROR_CODES.MYSQL_QUERY_FAILED, message:`Database query failed, error message: ${error}`});
        } else {
          resolve(results);
        }
      }
    );
  });
}

const replaceCustomerContacts = function(driver, customerId, contacts) {
  return deleteAllCustomerContacts(driver, customerId)
           .then( () => Promise.all(contacts.map(contact => addCustomerContact(driver, 
                                                                               customerId, 
                                                                               `${contact.name.replace(/\n/g, '')}`,
                                                                               `${contact.iban.replace(/\n/g, '')}`))))
}

module.exports = { getAllCustomerContacts, addCustomerContact, deleteAllCustomerContacts, replaceCustomerContacts }