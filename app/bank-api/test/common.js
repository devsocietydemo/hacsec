const USERNAME = 2241;
const ACCOUNT_NUMBER = 86433;
const UNAUTHORIZED_USERNAME = 2242;
const UNAUTHORIZED_ACCOUNT_NUMBER = 86436;
const VALID_PASSWORD = 'password';
const INVALID_PASSWORD = 'incorrect';
const WEAK_PASSWORD_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
const URL = process.env.API_HOST_URL || 'http://localhost';

module.exports = { USERNAME, 
                   ACCOUNT_NUMBER,
                   UNAUTHORIZED_USERNAME, 
                   UNAUTHORIZED_ACCOUNT_NUMBER,
                   VALID_PASSWORD, 
                   INVALID_PASSWORD, 
                   WEAK_PASSWORD_HASH, 
                   URL }