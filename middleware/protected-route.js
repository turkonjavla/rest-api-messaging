const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');

module.exports = (req, res, next) => {
  const authorizationHeader = req.get('Authorization');

  if (!authorizationHeader) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  const token = authorizationHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);

    if (!decodedToken) {
      const error = new Error('Not authentivated');
      error.statusCode = 401;
      throw error;
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
};
