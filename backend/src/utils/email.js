import nodemailer from "nodemailer";
import { config } from "../../config.js";

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false,
  auth: { user: config.smtp.user, pass: config.smtp.pass },
});

export const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"Magic Link Auth" <${config.smtp.user}>`,
    to,
    subject,
    text,
  });
};
