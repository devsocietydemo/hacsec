import {combineReducers} from 'redux';
import session from './session';
import operations from './operations';
import accounts from './accounts';
import currentBalance from './currentBalance';

const rootReducer = combineReducers({
  session,
  operations,
  accounts,
  currentBalance
});

export default rootReducer;
