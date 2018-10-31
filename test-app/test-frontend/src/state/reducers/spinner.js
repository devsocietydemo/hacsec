import { START_LOADING } from '../actions/spinner';

const defaultState = {
  spinning: true
};

const spinner = (state = defaultState, action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        spinning: true
      };
    default:
      return {
        spinning: false
      }
  }
}

export default spinner;
