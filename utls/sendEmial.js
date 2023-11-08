const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (options) => {
  // create transborter
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT_EMAIL,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  //   define email option
  const mailOptions = {
    from: "hello@test.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //   send email
  transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
