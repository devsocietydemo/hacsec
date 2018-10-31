const composePath = (...elements) => '/' + elements.filter(el => !!el).join('/');

const fetchTestApi = (path, ...options) => fetch(
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

export const initSession = (data) => fetchTestApi(['init'], {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

export const encryptUser = (data, sessionId) => fetchTestApi(['encrypt'], {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'sessionId': sessionId
  },
  body: JSON.stringify(data)
});
