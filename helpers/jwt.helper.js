const jwt = require('jsonwebtoken');
const { getEnvConfig } = require('../core/env.config');

const createToken = (userId) => {
  return jwt.sign(
    { id: userId },
    getEnvConfig().jwt_secret,
    { expiresIn: getEnvConfig().jwt_expiration }
  );
};

module.exports = {
  createToken
};