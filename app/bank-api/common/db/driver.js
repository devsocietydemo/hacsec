var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.BANKAPI_DB_HOSTNAME,
  user: 'bankappuser',
  password: 'AppUserPassword',
  database: 'bankdb',
  multipleStatements: true
});

var driver = (function () {
  function _query(query, params, callback) {
    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        callback(err, null);
        throw err;
      }

      connection.query(query, params, function (err, rows) {
        connection.release();
        if (!err) {
          callback(null, rows);
        }
        else {
          callback(err, null);
        }
      });

      connection.on('error', function (err) {
        connection.release();
        callback(err, null);
        throw err;
      });
    });
  }

  return {
    query: _query
  };
})();

module.exports = driver;