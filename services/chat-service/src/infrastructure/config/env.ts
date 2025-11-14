import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 4007,
  mongo_uri: process.env.MONGO_URI || "",
};