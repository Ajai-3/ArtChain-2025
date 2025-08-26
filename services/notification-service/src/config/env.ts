import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT,
  rabbitmq_url: process.env.RABBITMQ_URL || "",
};
