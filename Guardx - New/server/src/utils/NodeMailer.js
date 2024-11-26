import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  // host: "smtp.ethereal.email",
  // port: 587,
  // secure: false, 

  service: "Gmail",
  port:465,
  secure: false,

  auth: {
    user: process.env.NODE_MAIL_USER,
    pass: process.env.NODE_MAIL_PASS,
  },
});
  