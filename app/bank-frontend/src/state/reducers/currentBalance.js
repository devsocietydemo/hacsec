import { SET_CURRENT_BALANCE } from '../actions/currentBalance';
import { START_LOADING } from '../actions/spinner';

const defaultState = {
  transactions: [],
  account: {}
};

const accounts = (state = defaultState, action) => {
  switch (action.type) {
    case SET_CURRENT_BALANCE:
      return {
        ...state,
        transactions: action.transactions,
        account: action.account
      };

    case START_LOADING:
      return {
        ...defaultState
      };

    default:
      return state;
  }
};

export default accounts;
