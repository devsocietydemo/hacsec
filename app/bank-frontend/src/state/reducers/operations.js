import { SET_OPERATION, OPERATION_CURRENT_BALANCE } from '../actions/operations';

const defaultState = {
  operation: null,
  params: null
};

const operations = (state = defaultState, action) => {
  switch (action.type) {
    case SET_OPERATION:
      return {
        ...state,
        operation: action.operation,
        params: action.params
      }
    default:
      return state;
  }
};

export default operations;
