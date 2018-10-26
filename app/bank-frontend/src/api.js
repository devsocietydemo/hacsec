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
export const getUserAccounts = (id, sessionId) => fetchBankApi(['customers', id, 'accounts'], {
  headers: {
    'sessionId': sessionId
  }
});
export const getAccount = (id) => fetchBankApi(['accounts', id]);
export const getAccountTransactions = (id = null) => fetchBankApi(['accounts', id, 'transactions']);

export const getContacts = (id) => fetchBankApi(['contacts', id]);
export const addContact = (id, data) => fetchBankApi(['contacts', id], {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

export const importContacts = (id, xml) => fetchBankApi(['contacts', id, 'xml'], {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contactsXml: xml
  })
});

export const sendNormalTransfer = (data) => fetchBankApi(['transactions'], {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

export const processLoginOperation = (data) => fetchBankApi(['login'], {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

export const processLogoutOperation = (sessionId) => fetchBankApi(['logout'], {
  headers: {
    'sessionId': sessionId
  }
});
