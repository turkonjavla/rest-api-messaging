const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');

module.exports = (req, res, next) => {
  const authorizationHeader = req.get('Authorization');

  if (!authorizationHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authorizationHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);

    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }

    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
  } catch (error) {
    req.isAuth = false;
    return next();
  }
};
