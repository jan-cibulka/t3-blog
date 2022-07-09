import nodemailer from "nodemailer";
import { baseUrl } from "./constants";

export async function sendLoginEmail(
  email: string,
  url: string,
  token: string
) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,

    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  const mailOptions = {
    from: "Jane Doe <j.doe@example.com>",
    to: email,
    subject: "Login to your account",
    html: `Login by clicking <a href="${baseUrl}/login#token=${token}">HERE</a>`,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
  console.log("Preview url", nodemailer.getTestMessageUrl(info));
}
