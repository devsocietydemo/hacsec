const composePath = (...elements) => '/' + elements.filter(el => !!el).join('/');

const fetchBankApi = (path, ...options) => fetch(
    composePath('api', 'v1', ...path),
    ...options
  )
  .then(response => {
    if (response.status !== 200) {
      return response.text().then(text => {
        throw {text, code: response.status};
      })

    }

    return response.json()
  });

export const getCustomer = (id) => fetchBankApi(['customers', id]);
export const getTransaction = (id) => fetchBankApi(['transactions', id]);
export const getUserAccounts = (id) => fetchBankApi(['customers', id, 'accounts']);
export const getAccount = (id) => fetchBankApi(['accounts', id]);
export const getAccountTransactions = (id = null) => fetchBankApi(['accounts', id, 'transactions']);

export const sendNormalTransfer = (data) => fetchBankApi(['transactions'], {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
