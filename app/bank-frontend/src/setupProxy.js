const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api', { target: 'http://localhost:80' })),
  app.use(proxy('/cdn', { target: 'http://localhost:80' }));
};
