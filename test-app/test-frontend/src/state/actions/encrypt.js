import { encryptUser } from '../../api';
import { setError, ERROR_SESSION_NOT_SET, ERROR_HASH_NOT_VALID } from './errors';
export const SET_USER_EMAIL = 'setEmail';
export const SET_HOST_NAME = 'setHostname';
export const SET_USER_HASH = 'setUserHash';

export const setEmail = email => ({
  type: SET_USER_EMAIL,
  email
});

export const setHostname = hostname => ({
  type: SET_HOST_NAME,
  hostname
});

export const setUserHash = hash => ({
  type: SET_USER_HASH,
  hash
});

export const encrypt = () => (dispatch, getState) => {
  const currentSessionId = getState().session.sessionId;
  const email = getState().encrypt.email;
  const hostname = getState().encrypt.hostname;

  if (!currentSessionId) {
    dispatch(setError(ERROR_SESSION_NOT_SET));
  } else {
    const UUID = getState().session.UUID;
    const body = { id: UUID, email: email, hostname: hostname };
    encryptUser(body, currentSessionId)
      .then(
        data => {
          if (data.response.hash) {
            dispatch(setUserHash(data.response.hash));
          } else {
            dispatch(setError(ERROR_HASH_NOT_VALID));
          }
        },
        error => dispatch(setError(ERROR_HASH_NOT_VALID, error))
      )
  }
}