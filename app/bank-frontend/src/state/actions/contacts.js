import { stateToHTML } from 'draft-js-export-html';

import { OPERATION_CONTACTS, selectOperation } from './operations';
import { setError, ERROR_ADD_CONTACT_FAILED, ERROR_IMPORT_CONTACT_FAILED } from './errors';
import { startLoading } from './spinner';
import { addContact, importContacts } from '../../api';

export const SET_INPUT_NEW_CONTACT_DATA = 'setInputNewContactData';
export const SET_CONTACTS = 'setContacts';

export const setInputNewContactData = (field, value) => ({
  type: SET_INPUT_NEW_CONTACT_DATA,
  values: {
    [field]: value
  }
});

export const setContacts = (contacts) => ({
  type: SET_CONTACTS,
  contacts
});

export const initAddContact = () => (dispatch, getState) => {
  const currentUser = getState().session.currentUser;

  const {name, iban} = getState().contacts.newContact
  const dataToSend = {
    name,
    iban
  };

  dispatch(startLoading());
  return addContact(currentUser.id, dataToSend)
    .then(
      () => dispatch(selectOperation(OPERATION_CONTACTS)),
      error => dispatch(setError(ERROR_ADD_CONTACT_FAILED, error.message))
    );
}

export const initImportContacts = () => (dispatch, getState) => {
  const currentUser = getState().session.currentUser;
  const dataToSend = getState().contacts.newContact.importXml;

  dispatch(startLoading());
  return importContacts(currentUser.id, dataToSend)
    .then(
      () => dispatch(selectOperation(OPERATION_CONTACTS)),
      error => dispatch(setError(ERROR_IMPORT_CONTACT_FAILED, error.message))
    );
}
