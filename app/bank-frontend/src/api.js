const composePath = (...elements) => '/' + elements.filter(el => !!el).join('/');

const fetchBankApi = (path, ...options) => {
  debugger;
  return fetch(
      composePath('api', 'v1', ...path),
      ...options
    ).then(response => response.json())
  };

export const getCustomer = (id) => fetchBankApi(['customers', id]);
export const getTransaction = (id) => fetchBankApi(['transactions', id]);
export const getAccount = (id) => fetchBankApi(['accounts', id]);
export const getAccountTransactions = (id = null) => fetchBankApi(['accounts', id, 'transactions']);
