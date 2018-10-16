import {combineReducers} from 'redux';
import session from './session';
import operations from './operations';
import accounts from './accounts';
import currentBalance from './currentBalance';
import newTransfer from './newTransfer';
import errors from './errors';

const rootReducer = combineReducers({
  session,
  operations,
  accounts,
  currentBalance,
  newTransfer,
  errors
});

export default rootReducer;
