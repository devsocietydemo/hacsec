import { SET_ACCOUNTS } from '../actions/accounts';

const defaultState = {
  accounts: []
};

const accounts = (state = defaultState, action) => {
  switch (action.type) {
    case SET_ACCOUNTS:
      return {
        ...state,
        accounts: action.accounts
      }
    default:
      return state;
  }
};

export default accounts;
