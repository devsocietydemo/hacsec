const { MYSQL_ERROR_CODES } = require('./errors');

const getDBConnectionStatus = function(driver) {
  return new Promise( function(resolve, reject) {
    driver.query('SELECT 1 AS matches', null, 
      function (error, results) {
        if (error) {
          reject({code: MYSQL_ERROR_CODES.MYSQL_QUERY_FAILED, message: `Database query failed, error message: ${error}`});
        } else {
          resolve(results[0].matches === 1);
        }
      }
    );
  });
}

module.exports = { getDBConnectionStatus }