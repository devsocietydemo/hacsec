var express = require('express');
var { getDBConnectionStatus } = require('../common/db/health');
var { getRedisConnectionStatus } = require('../common/redis/sessions');
var { sendCorrectResult, sendErrorMessage } = require('../common/http/handler');
var router = express.Router();

router.get('/', function(req, res) {
  getRedisConnectionStatus(res.locals.redisClient)
    .then( () => getDBConnectionStatus(res.locals.driver))
    .then( () => sendCorrectResult(res, {status:"OK"}))
    .catch( error => sendErrorMessage(res, error));
});

module.exports = router;