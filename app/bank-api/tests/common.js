const USERNAME = 2241;
const UNAUTHORIZED_USERNAME = 2242;
const VALID_PASSWORD = 'password';
const INVALID_PASSWORD = 'incorrect';
const URL = process.env.API_HOST_URL || 'http://localhost';

module.exports = { USERNAME, UNAUTHORIZED_USERNAME, VALID_PASSWORD, INVALID_PASSWORD, URL }