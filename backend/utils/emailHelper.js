const nodemailer = require("nodemailer");
const config = require('../config/env')

const mailHelper = async () => {
  let transporter = nodemailer.createTransport({
    host: config.SMTP_MAIL_HOST,
    port: config.SMTP_MAIL_PORT,
     auth: {
      user: config.SMTP_MAIL_USERNAME, // generated ethereal user
      pass: config.SMTP_MAIL_PASSWORD, // generated ethereal password
    },
  });

  const message = {
    from: 'rohtash@vijkom.com', // sender address
    to: option.email, // list of receivers
    subject: options.subject, // Subject line
    text: option.message, // plain text body
  }

  // send mail with defined transport object
 await transporter.sendMail(message);
};

module.exports = mailHelper;
