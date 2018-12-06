const USERNAME = 2241;
const UNAUTHORIZED_USERNAME = 2242;
const VALID_PASSWORD = 'password';
const INVALID_PASSWORD = 'incorrect';
const WEAK_PASSWORD_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
const URL = process.env.API_HOST_URL || 'http://localhost';

module.exports = { USERNAME, 
                   UNAUTHORIZED_USERNAME, 
                   VALID_PASSWORD, 
                   INVALID_PASSWORD, 
                   WEAK_PASSWORD_HASH, 
                   URL }