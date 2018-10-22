import { getCustomer, processLoginOperation } from '../../api';
import { setUser, removeUser, setUserSessionId } from '../../sessionManager';
import { OPERATION_ACCOUNTS, selectOperation } from './operations';
import { ERROR_LOGIN_NOT_FOUND, ERROR_LOGIN_FETCH_FAILED, setError } from './errors';
import { sha256 } from "js-sha256";

export const SET_LOGIN_STATE = 'setLoginState';
export const SET_LOGIN_ERROR = 'setLoginError';
export const SET_SESSION_ID = "setSessionId";
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

export const setSessionId = (sessionId) => ({
  type: SET_SESSION_ID,
  sessionId
})


export const authenticate = () => (dispatch, getState) => {
  const {login} = getState().session;
  const credentials = {id: getState().session.login, password: sha256(getState().session.password)};

  processLoginOperation(credentials)
    .then(
      data => {
        if (data.response.success) {
          dispatch(setSessionId(data.response.sessionId));
          setUserSessionId(data.response.sessionId);
          getCustomer(login)
          .then(
            data => {
              if (data.response.length > 0) {
                setUser(data.response[0]);
      
                dispatch(setLoginState(data.response[0]));
                dispatch(selectOperation(OPERATION_ACCOUNTS));
              } else {
                dispatch(setError(ERROR_LOGIN_NOT_FOUND));
              }
            },
            error => dispatch(setError(ERROR_LOGIN_FETCH_FAILED, error))
          )
        } else {
          dispatch(setError(ERROR_LOGIN_NOT_FOUND));
        }
      },
      error => dispatch(setError(ERROR_LOGIN_FETCH_FAILED, error))
    )
};

export const logout = () => (dispatch, getState) => {
  removeUser();
  dispatch(setLoginState(null));
}
