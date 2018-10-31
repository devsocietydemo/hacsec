import { SET_SESSION_ID, SET_UUID } from '../actions/session';

const defaultState = {
        UUID: null,
        sessionId: null
      };

const session = (state = defaultState, action) => {
  switch (action.type) {
    case SET_SESSION_ID:
      return {
        ...state,
        sessionId: action.sessionId
      }
    case SET_UUID:
      return {
        ...state,
        UUID: action.UUID
      }
    default:
      return state;
  }
};

export default session;
