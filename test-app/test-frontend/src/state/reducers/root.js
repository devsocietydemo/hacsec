import {combineReducers} from 'redux';
import encrypt from './encrypt';
import session from './session';
import errors from './errors';
import spinner from './spinner';

const rootReducer = combineReducers({
  encrypt,
  session,
  errors,
  spinner
});

export default rootReducer;
