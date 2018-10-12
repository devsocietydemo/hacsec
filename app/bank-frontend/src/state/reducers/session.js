import { SET_LOGIN_STATE, SET_INPUT_CREDENTIALS, SET_LOGIN_ERROR } from '../actions/session';

const defaultState = {
  login: '',
  password: '',
  currentUser: null
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
