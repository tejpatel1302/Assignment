const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};
