const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');


module.exports = (req, res, next) => {
  console.log(req.cookies)
  const { authorization } = req.cookies;
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload

  try {
    payload = jwt.verify(token, 'super-strong-secret')
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  next();
}