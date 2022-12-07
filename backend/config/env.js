require('dotenv').config();

const env = process.env;

const config = {
  PORT: env.PORT,
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRY:env.JWT_EXPIRY,
  MONGODB_URL: env.MONGODB_URL
};


module.exports= config;