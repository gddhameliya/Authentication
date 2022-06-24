const nodemailer = require("nodemailer");

const sendMail = async (email, message) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "brisa.wuckert20@ethereal.email",
        pass: "FJPwq5xsZfeTA5XpA5",
      },
    });
  
    await transporter.sendMail({
      from: "brisa.wuckert20@ethereal.email",
      to: email,
      subject: "Receive otp for forgot password..",
      text: message,
    });
  };

  module.exports = sendMail;