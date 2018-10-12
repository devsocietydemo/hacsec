import { SET_CURRENT_BALANCE } from '../actions/currentBalance';

const defaultState = {
  transactions: [],
  accountId: null
};

const accounts = (state = defaultState, action) => {
  switch (action.type) {
    case SET_CURRENT_BALANCE:
      return {
        ...state,
        transactions: action.transactions,
        accountId: action.accountId
      };

    default:
      return state;
  }
};

export default accounts;
