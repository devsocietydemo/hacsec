import {combineReducers} from 'redux';
import session from './session';
import operations from './operations';


const rootReducer = combineReducers({
  session,
  operations
});

export default rootReducer;
