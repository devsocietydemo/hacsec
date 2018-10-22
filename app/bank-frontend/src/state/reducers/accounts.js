import { SET_ACCOUNTS } from '../actions/accounts';
import { START_LOADING } from '../actions/spinner';

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

    case START_LOADING:
      return {
        ...defaultState
      };

    default:
      return state;
  }
};

export default accounts;
