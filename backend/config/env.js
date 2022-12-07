require('dotenv').config();

const env = process.env;

const config = {
  PORT: env.PORT,
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRTY: env.JWT_EXPIRTY,
  MONGODB_URL: env.MONGODB_URL
};



module.exports= config;