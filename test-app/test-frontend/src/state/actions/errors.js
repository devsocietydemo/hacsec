export const SET_ERROR = 'setError';

// Error definitions

// Login (class 1)
export const ERROR_LOGIN_NOT_FOUND = 101;
export const ERROR_LOGIN_FETCH_FAILED = 102;
export const ERROR_LOGIN_FAILED = 103;
export const ERROR_SESSION_NOT_SET = 104;
export const ERROR_HASH_NOT_VALID = 105;

export const setError = (code) => ({
  type: SET_ERROR,
  code,
  time: new Date().getTime()
});
