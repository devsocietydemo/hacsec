const storageKey = 'acme.session';
const sessionIdKey = 'acme.sessionId';

export const setUser = (user) => window.sessionStorage.setItem(storageKey, JSON.stringify(user));

export const getUser = () => {
  const value = window.sessionStorage.getItem(storageKey);
  return value ? JSON.parse(value) : null
};

export const removeUser = () => window.sessionStorage.removeItem(storageKey);

export const setUserSessionId = (sessionId) => window.sessionStorage.setItem(sessionIdKey, sessionId);

export const getUserSessionId = () => {
  return window.sessionStorage.getItem(sessionIdKey);  
};
