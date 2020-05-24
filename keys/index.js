require('dotenv').config();

module.exports = {
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS,
};
