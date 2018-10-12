import { getCustomer } from '../../api';

import { OPERATION_ACCOUNTS, selectOperation } from './operations';

export const SET_LOGIN_STATE = 'setLoginState';
export const SET_LOGIN_ERROR = 'setLoginError';
export const SET_INPUT_CREDENTIALS = 'setInputCredentials';

export const setInputCredentials = (field, value) => ({
  type: SET_INPUT_CREDENTIALS,
  values: {
    [field]: value
  }
});

export const setLoginState = (currentUser) => ({
  type: SET_LOGIN_STATE,
  currentUser
});

export const setLoginError = (error) => ({
  type: SET_LOGIN_ERROR,
  error
});

export const authenticate = () => (dispatch, getState) => {
  const {login, password} = getState().session;

  getCustomer(login).then(data => {
    if (data.response.length > 0) {
      dispatch(setLoginState(data.response[0]));
      dispatch(selectOperation(OPERATION_ACCOUNTS));
    } else {
      dispatch(setLoginError('Given user ID is not found in the system.'));
    }

  })
}
