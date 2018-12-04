const composePath = (...elements) => '/' + elements.filter(el => !!el).join('/'); 

const fetchBankApi = (path, ...options) => 
  fetch(
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


export const getCustomer = function(id, sessionId) {
  var params = [];
  params.push('customers');
  params.push(id);
  return fetchBankApi(params, {
    headers: {
      'sessionId': sessionId
    }
  });
}
export const getTransaction = function(id, sessionId) {
  var params = [];
  params.push('transactions');
  params.push(id);
  return fetchBankApi(params, {
    headers: {
      'sessionId': sessionId
    }
  });
}

export const getUserAccounts = function(id, sessionId) {
  var params = [];
  params.push('customers');
  params.push(id);
  params.push('accounts');
  return fetchBankApi(params, {
    headers: {
      'sessionId': sessionId
    }
  });
}
export const getAccount = function(id, sessionId) {
  var params = [];
  params.push('accounts');
  params.push(id);
  return fetchBankApi(params, {
    headers: {
      'sessionId': sessionId
    }
  });
}

export const getAccountTransactions = function(id = null, sessionId) {
  var params = [];
  params.push('accounts');
  params.push(id);
  params.push('transactions');
  return fetchBankApi(params, {
    headers: {
      'sessionId': sessionId
    }
  });
}

export const getContacts = function(id, sessionId) { 
  var params = [];
  params.push('contacts');
  params.push(id);
  return fetchBankApi(params, {
    headers: {
      'sessionId': sessionId
    }
  });
}
export const addContact = function(id, data, sessionId) { 
  var params = [];
  params.push('contacts');
  params.push(id);
  return fetchBankApi(params, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'sessionId': sessionId
    },
    body: JSON.stringify(data)
  });
}

export const importContacts = function(id, xml, sessionId) {
  var params = [];
  params.push('contacts');
  params.push(id);
  params.push('xml')
  return fetchBankApi(params, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'sessionId': sessionId
    },
    body: JSON.stringify({
      contactsXml: xml
    })
  });
}

export const sendNormalTransfer = function(data, sessionId) {
  var params = [];
  params.push('transactions');
  return fetchBankApi(params, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'sessionId': sessionId
    },
    body: JSON.stringify(data)
  });
}

export const processLoginOperation = function(data) {
  var params = [];
  params.push('login');
  return fetchBankApi(params, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

// export const listActiveSessions = function() {
//   var params = [];
//   params.push('login');
//   params.push('sessions');
//   return fetchBankApi(params);
// }

export const processLogoutOperation = function(sessionId) {
  var params = [];
  params.push('logout');
  return fetchBankApi(params, {
    method: 'POST',
    headers: {
      'sessionId': sessionId
    }
  });
}