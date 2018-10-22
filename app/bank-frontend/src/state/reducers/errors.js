import { SET_ERROR } from '../actions/errors';
import { START_LOADING } from '../actions/spinner';

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

    case START_LOADING:
      // invalidate all errors after AJAX request start
      return {
        errors: state.errors.map(error => ({
          ...error,
          time: 0
        }))
      }

    default:
      return state;
  }
};

export default accounts;
