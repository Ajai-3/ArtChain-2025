import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT,
  rabbitmq_url: process.env.RABBITMQ_URL || "",
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    user: process.env.EMAIL_USER || "artchain001@gmail.com",
    pass: process.env.EMAIL_PASS || "tocq irpj hbbb ettz",
    fromName: process.env.EMAIL_FROM_NAME || "ArtChain",
    fromAddress: process.env.EMAIL_FROM_ADDRESS || "artchain001@gmail.com",
    secure: process.env.EMAIL_SECURE === "true",
  },
  aws: {
    email_template_bucket: process.env.EMAIL_TEMPLATE_BUCKET
  }
};
