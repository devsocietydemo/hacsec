import { SET_LOGIN_STATE, SET_INPUT_CREDENTIALS, SET_LOGIN_ERROR, SET_SESSION_ID } from '../actions/session';
import { getUser, getUserSessionId } from '../../sessionManager';

const defaultState = {
        login: '',
        password: '',
        currentUser: getUser() || null,
        sessionId: getUserSessionId() || null
      };

const session = (state = defaultState, action) => {
  switch (action.type) {
    case SET_INPUT_CREDENTIALS:
      return {
        ...state,
        ...action.values
      }
    case SET_LOGIN_STATE:
      return {
        ...state,
        currentUser: action.currentUser
      }
    case SET_SESSION_ID:
      return {
        ...state,
        login: defaultState.login,
        password: defaultState.password,
        sessionId: action.sessionId
      }
    case SET_LOGIN_ERROR:
      return {
        ...state,
        error: action.error
      }
    default:
      return state;
  }
};

export default session;
