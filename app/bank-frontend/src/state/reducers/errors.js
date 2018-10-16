import { SET_ERROR } from '../actions/errors';

const defaultState = {
  errors: []
};

const accounts = (state = defaultState, action) => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        errors: [
          ...state.errors,
          {
            code: action.code,
            time: action.time
          }
        ]
      };

    default:
      return state;
  }
};

export default accounts;
