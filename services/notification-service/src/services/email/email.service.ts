import nodemailer from "nodemailer";
import { config } from "../../config/env";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

async function sendEmail(mailOptions: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: `"${config.email.fromName}" <${config.email.fromAddress}>`,
      ...mailOptions,
    });

  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

export { sendEmail };
