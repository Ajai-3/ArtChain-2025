import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT,
  elastic_url: process.env.ELASTIC_URL,
  rabbitmq_url: process.env.RABBITMQ_URL || "",
};
