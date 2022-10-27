// eslint-disable-next-line import/no-unresolved
require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorization-err');

const { JWT_SECRET = 'super-secret-key' } = process.env;

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
      return next(new AuthorizationError('Необходима авторизация'));
    }

    req.user = payload;

    next();
  } else {
    return next(new AuthorizationError('Необходима авторизация'));
  }
};

module.exports = auth;
