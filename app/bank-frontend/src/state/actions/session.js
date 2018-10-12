import { getCustomer } from '../../api';

export const SET_LOGIN_STATE = 'setLoginState';
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

export const authenticate = () => (dispatch, getState) => {
  const {login, password} = getState().session;

  getCustomer(login).then(data =>
    data.response.length > 0 &&
      dispatch(setLoginState(data.response[0]))
  )
}
