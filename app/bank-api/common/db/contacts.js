const { MYSQL_ERROR_CODES } = require('../db/errors');

const getAllCustomerContacts = function(connection, customerId) {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT * from contacts WHERE customer_id = ?', [customerId], 
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

const addCustomerContact = function(connection, customerId, name, iban) {
  return new Promise(function(resolve, reject) {
    connection.query('INSERT INTO contacts (name, iban, customer_id) VALUES (?, ?, ?)', [name,iban,customerId],
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

const deleteAllCustomerContacts = function(connection, customerId) {
  return new Promise(function(resolve, reject) {
    connection.query('DELETE FROM contacts WHERE customer_id = ?', [customerId],
      function(error, results) {
        if (error) {
          reject({code: MYSQL_ERROR_CODES.MYSQL_QUERY_FAILED, message:`Database query failed, error message: ${error}`});
        } else {
          resolve(null);
        }
      }
    );
  });
}

const replaceCustomerContacts = function(connection, customerId, contacts) {
  return deleteAllCustomerContacts(connection, customerId)
           .then( () => Promise.all(contacts.map(contact => addCustomerContact(connection, 
                                                                               customerId, 
                                                                               `${contact.name.replace(/\n/g, '')}`,
                                                                               `${contact.iban.replace(/\n/g, '')}`))))
}

module.exports = { getAllCustomerContacts, addCustomerContact, deleteAllCustomerContacts, replaceCustomerContacts }