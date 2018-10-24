import { SET_INPUT_TRANSFER_DATA, SET_ACCOUNTS_FOR_TRANSFER } from '../actions/newTransfer';
import { START_LOADING } from '../actions/spinner';
import { EditorState } from 'draft-js';

const defaultState = {
  accounts: [],
  senderBankAccount: '',
  targetBankAccountNumber: '',
  amount: '',
  description: EditorState.createEmpty()
};

const newTransfer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_INPUT_TRANSFER_DATA:
      return {
        ...state,
        ...action.values
      };

    case SET_ACCOUNTS_FOR_TRANSFER:
      return {
        ...defaultState,
        accounts: action.accounts,
        senderBankAccount: action.senderBankAccount
      };

    case START_LOADING:
      return {
        ...defaultState
      };

    default:
      return state;
  }
};

export default newTransfer;
