const nodemailer = require('nodemailer');
const ejs = require("ejs");

module.exports = function(config, cb) {
  const smtpConfig = {
    host: config.smtpHost,
    port: config.port,
    secure: config.secure, // use SSL
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    }
  };

  const transporter = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    from: config.from,
    to: config.to,
    cc: config.cc,
    subject: config.subject,
    html: ejs.render(config.htmlStr, config.htmlContext),
    attachments: config.attachments
  };
  transporter.sendMail(mailOptions, cb);
};
