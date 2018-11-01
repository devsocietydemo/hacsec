import { SET_USER_EMAIL, SET_HOST_NAME, SET_USER_HASH, RESET_USER_DATA} from '../actions/encrypt';

const defaultState = {
  email: '',
  hostname: '',
  hash: ''
};

const encrypt = (state = defaultState, action) => {
  switch (action.type) {
    case SET_USER_EMAIL:
    return {
      ...state,
      email: action.email
    };

    case SET_HOST_NAME:
    return {
      ...state,
      hostname: action.hostname
    };

    case SET_USER_HASH:
    return {
      ...state,
      hash: action.hash
    };

    case RESET_USER_DATA:
    return {
      ...state,
      email: '',
      hostname: '',
      hash: ''
    }

    default:
    return state;
  }
}

export default encrypt;