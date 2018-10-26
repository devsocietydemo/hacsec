import { SET_INPUT_NEW_CONTACT_DATA, SET_CONTACTS } from '../actions/contacts';
import { START_LOADING } from '../actions/spinner';

const defaultState = {
  contacts: [],
  newContact: {
    name: '',
    iban: '',
    importXml: ''
  }
};

const newTransfer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_INPUT_NEW_CONTACT_DATA:
      return {
        ...state,
        newContact: {
          ...state.newContact,
          [action.field]: action.value
        }
      };

    case SET_CONTACTS:
      return {
        ...state,
        contacts: action.contacts
      };

    case START_LOADING:
      return {
        ...defaultState,
        newContact: {
          ...defaultState.newContact
        }
      };

    default:
      return state;
  }
};

export default newTransfer;
