import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service:"gmail",
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SENDER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendMail=async (reciver ,otp) => {
  const info = await transporter.sendMail({
    from: `Yara Srinibas ${process.env.SENDER}`,
    to: reciver,
    subject:(otp)?"OTP for yamazone verification ": "Hello ",
    html: (otp)?`here is your otp for <b>yamazone:<h1>${otp}</h1></b>`:"Welcome to yamazone!, for merchant account - here is the admin contact:<h1><b>+918117032137 </b></h1>, to get verified", // HTML body
  });

  console.log("Message sent:", info.messageId);
  return "mail sent sucessfully";
};

export default sendMail;