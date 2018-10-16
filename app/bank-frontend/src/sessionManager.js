const storageKey = 'acme.session';

export const setUser = (user) => window.sessionStorage.setItem(storageKey, JSON.stringify(user));

export const getUser = () => {
  const value = window.sessionStorage.getItem(storageKey);
  return value ? JSON.parse(value) : null
};

export const removeUser = () => window.sessionStorage.removeItem(storageKey);
