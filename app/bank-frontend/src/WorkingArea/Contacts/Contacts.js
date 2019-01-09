import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { IoIosCash } from 'react-icons/io';

import Error from '../../Error/Error';
import FormGroup from '../../FormGroup/FormGroup';
import { NavLinkComponent } from '../../router';

import { setInputNewContactData, initImportContacts, initAddContact, initExportContacts } from '../../state/actions/contacts';
import { OPERATION_NEW_TRANSFER } from '../../state/actions/operations';

import { exportContacts } from '../../api';
import './Contacts.scss';

const getXmlFromInput = (domEl) => new Promise((resolve, reject) => {
  const fr = new FileReader();

  if (domEl.files.length === 1) {
    fr.onload = () => resolve(fr.result);
    fr.readAsText(domEl.files[0]);
  }
});

const doUploadXml = (e, setData, importContacts) => {
  const eventTarget = e.target;

  getXmlFromInput(eventTarget).then(result => {
    setData('importXml', result);
    importContacts();
    eventTarget.value = "";
  })
};

const Contacts = ({contacts, addContact, importContacts, setData, newContact,
  userId, sessionId}) => {

  return (
    <div className="contacts">
      <div className="new-contact">
        <h3>Add new...</h3>
        <div className="new-contact-input">
          <FormGroup label="Name">
            <input className="banking-input"
                   onChange={(e) => setData('name', e.target.value)}
                    value={newContact.name} />
          </FormGroup>

          <FormGroup label="IBAN">
            <input className="banking-input"
                   onChange={(e) => setData('iban', e.target.value)}
                    value={newContact.iban} />
          </FormGroup>

          <div className="new-contact-actions">
            <button className="banking-button active"
                    onClick={() => addContact()}>
              Add
            </button>
          </div>
        </div>

        <div className="new-contact-or">——— or ————</div>

        <h3>Keep contacts in XML file</h3>
        <div className="new-contact-xml">
          <p>
            <strong>Warning:</strong> When importing, all contacts will be deleted and overwritten by XML content.
          </p>
          <div className="new-contact-actions">
            <div className="banking-button file-button active">
                <input type="file"
                       onChange={ (e) => doUploadXml(e, setData, importContacts) }
                    />
              Import new from XML
            </div>
            <button className="banking-button active"
                    onClick={() => exportContacts(userId, sessionId)}>
              Export existing to XML
            </button>
          </div>
        </div>
      </div>


      <ul className="contacts-list">
      {contacts.map((contact, key) =>
        <li key={key} className="contacts-list-item">
          <div className="contact">
            <span className="contact-name">{contact.name}</span>
            <span className="contact-iban">{contact.iban}</span>
            <span className="contact-actions">
             <NavLinkComponent to={OPERATION_NEW_TRANSFER}
                               params={{iban: contact.iban}}
                               className="banking-button banking-button-white banking-button-white-bg">
               Transfer...
             </NavLinkComponent>
            </span>
          </div>
        </li>
      )}
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({
  newContact: state.contacts.newContact,
  contacts: state.contacts.contacts,
  userId: state.session.currentUser.id,
  sessionId: state.session.sessionId
});

const mapDispatchToProps = dispatch => ({
  setData: (...props) => dispatch(setInputNewContactData(...props)),
  addContact: () => dispatch(initAddContact()),
  importContacts: () => dispatch(initImportContacts())
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
