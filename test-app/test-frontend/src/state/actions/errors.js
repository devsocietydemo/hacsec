export const SET_ERROR = 'setError';

// Error definitions

// Login (class 1)
export const ERROR_INIT_FAILED = 101;
export const ERROR_SESSION_NOT_SET = 102;
export const ERROR_SESSION_EXPIRED = 103;
export const ERROR_HASH_NOT_VALID = 104;
export const ERROR_ENCRYPT_FAILED = 105;

export const setError = (code) => ({
  type: SET_ERROR,
  code,
  time: new Date().getTime()
});
