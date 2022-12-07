require("dotenv").config();

const env = process.env;

const config = {
  PORT: env.PORT,
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRY: env.JWT_EXPIRY,
  MONGODB_URL: env.MONGODB_URL,
  CLOUDINARY_CLOUD_NAME: env.cloudinary_cloud_name,
  CLOUDINARY_API_KEY: env.cloudinary_api_key,
  CLOUDINARY_API_SECRET: env.cloudinary_api_secret,
  SMTP_MAIL_HOST: env.SMTP_MAIL_HOST,
  SMTP_MAIL_PORT: env.SMTP_MAIL_PORT,
  SMTP_MAIL_USERNAME: env.SMTP_MAIL_USERNAME,
  SMTP_MAIL_PASSWORD: env.SMTP_MAIL_PASSWORD,
  SMTP_MAIL_EMAIL: env.SMTP_MAIL_EMAIL,
};

module.exports = config;
