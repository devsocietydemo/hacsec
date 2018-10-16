import { SET_INPUT_TRANSFER_DATA, SET_ACCOUNTS_FOR_TRANSFER } from '../actions/newTransfer';

const defaultState = {
  accounts: [],
  senderBankAccount: '',
  targetBankAccountNumber: '',
  amount: '',
  description: ''
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

    default:
      return state;
  }
};

export default newTransfer;
