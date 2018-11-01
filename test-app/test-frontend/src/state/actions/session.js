import { startLoading } from './spinner';
import { ERROR_SESSION_NOT_SET, ERROR_INIT_FAILED, setError } from './errors';
import { v4 as uuid } from 'uuid';

import { initSession } from "../../api";

export const SET_SESSION_ID = "setSessionId";
export const SET_UUID = "setUUID"

export const setSessionId = (sessionId) => ({
  type: SET_SESSION_ID,
  sessionId
});

export const setUUID = (UUID) => ({
  type: SET_UUID,
  UUID
});

export const init = () => (dispatch, getState) => {
  const currentSessionId = getState().session.sessionId;

  if (!currentSessionId) {
    dispatch(startLoading());
    const idValue = uuid();
    dispatch(setUUID(idValue));
    initSession({id:idValue})
      .then(
        data => {
          if (data.response.success) {
            dispatch(setSessionId(data.response.sessionId));
          } else {
            dispatch(setError(ERROR_SESSION_NOT_SET));
          }
        },
        error => dispatch(setError(ERROR_INIT_FAILED, error))
      )
  }
}

