require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorization-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
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
