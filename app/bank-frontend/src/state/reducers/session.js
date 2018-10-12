import { SET_LOGIN_STATE, SET_INPUT_CREDENTIALS } from '../actions/session';

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
    default:
      return state;
  }
};

export default session;
