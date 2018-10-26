import {combineReducers} from 'redux';
import session from './session';
import operations from './operations';
import accounts from './accounts';
import currentBalance from './currentBalance';
import newTransfer from './newTransfer';
import errors from './errors';
import spinner from './spinner';
import contacts from './contacts';

const rootReducer = combineReducers({
  session,
  operations,
  accounts,
  contacts,
  currentBalance,
  newTransfer,
  errors,
  spinner
});

export default rootReducer;
