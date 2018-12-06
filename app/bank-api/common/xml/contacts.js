var libxmljs = require('libxmljs');
var { XML_ERROR_CODES } = require('./errors');

var libxmlParseOptions = {
  nocdata: true,
  noblanks: true,
  noent: false
};

const parseContactsXml = function(contactsXml) {
  try {
    const parsedXml = libxmljs.parseXmlString(contactsXml, libxmlParseOptions);
    const content = parsedXml.find('//contacts/contact');
    
    const contacts = content.map(el => ({
                                 'name': el.get('name').text(),
                                 'iban': el.get('iban').text()
                                 }));
    return Promise.resolve(contacts);
  } catch (error) {
    return Promise.reject({code: XML_ERROR_CODES.XML_PARSE_FAILED, message: `XML parsing failed, message: ${error}`});
  } 
}

module.exports = { parseContactsXml }