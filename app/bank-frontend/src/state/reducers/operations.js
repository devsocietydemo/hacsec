import { SET_OPERATION } from '../actions/operations';

const defaultState = {
  currentOperation: null
};

const operations = (state = defaultState, action) => {
  switch (action.type) {
    case SET_OPERATION:
      return {
        ...state,
        operation: action.operation
      }
    default:
      return state;
  }
};

export default operations;
