import {combineReducers} from 'redux';
import session from './session';
import operations from './operations';
import accounts from './accounts';
import currentBalance from './currentBalance';
import newTransfer from './newTransfer';

const rootReducer = combineReducers({
  session,
  operations,
  accounts,
  currentBalance,
  newTransfer
});

export default rootReducer;
