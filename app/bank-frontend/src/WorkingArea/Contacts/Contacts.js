import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import Error from '../../Error/Error';
import FormGroup from '../../FormGroup/FormGroup';
import { IoIosCash } from 'react-icons/io';

import { setInputNewContactData, initImportContacts, initAddContact } from '../../state/actions/contacts';
import { selectOperation, OPERATION_NEW_TRANSFER } from '../../state/actions/operations';


import './Contacts.scss';

const getXmlFromInput = (domEl) => {

}

const Contacts = ({contacts, goToTransfer, addContact, importContacts, setData, newContact}) => {
  return (
    <div className="contacts">
      <ul>
      {contacts.map((contact, key) =>
        <li key={key}>
          <div className="contact">
            <h2>{contact.name}</h2>
            <p>{contact.iban}</p>
            <span className="contact-actions">
              <button className="banking-button" onClick={() => goToTransfer(contact.iban)}>
                <IoIosCash />
              </button>
            </span>
          </div>
        </li>
      )}
      </ul>

      <div className="new-contact">
        <div className="new-contact-input">
          <FormGroup label="Nazwa">
            <input className="banking-input"
                   onChange={(e) => setData('name', e.target.value)}
                    value={newContact.name} />
          </FormGroup>

          <FormGroup label="IBAN">
            <input className="banking-input"
                   onChange={(e) => setData('iban', e.target.value)}
                    value={newContact.iban} />
          </FormGroup>

          <div className="add-contact-actions">
            <button className="banking-button"
                    onClick={() => addContact()}>
              Add
            </button>
          </div>
        </div>
        <div className="new-contacts-xml">

          <FormGroup label="XML File">
            <input type="file" className="banking-input"
                   onChange={(e) => setData('importXml', getXmlFromInput(e.target))}
                    value={newContact.iban} />
          </FormGroup>
          <div className="add-contact-actions">
            <button className="banking-button"
                    onClick={() => importContacts()}>
              Import from XML
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  newContact: state.contacts.newContact,
  contacts: state.contacts.contacts
});

const mapDispatchToProps = dispatch => ({
  goToTransfer: (iban) => dispatch(selectOperation(OPERATION_NEW_TRANSFER, {iban})),
  setData: (...props) => dispatch(setInputNewContactData(...props)),
  addContact: () => dispatch(initAddContact()),
  importContacts: () => dispatch(initImportContacts())
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
