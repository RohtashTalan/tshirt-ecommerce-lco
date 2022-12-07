require('dotenv').config();

const env = process.env;

const config = {
  PORT: env.PORT,
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRY:env.JWT_EXPIRY,
  MONGODB_URL: env.MONGODB_URL,
  CLOUDINARY_CLOUD_NAME: env.cloudinary_cloud_name,
  CLOUDINARY_API_KEY: env.cloudinary_api_key,
  CLOUDINARY_API_SECRET: env.cloudinary_api_secret,
};


module.exports= config;