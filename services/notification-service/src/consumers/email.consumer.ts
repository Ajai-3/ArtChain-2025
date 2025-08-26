import amqp from "amqplib";
import { sendEmail } from "../services/email/email.service";
import path from "path";
import fs from "fs";
import { config } from "../config/env";

const RABBITMQ_URL = config.rabbitmq_url;
const TEMPLATES_DIR = path.join(__dirname, "../email-templates");

interface EmailMessage {
  type: "VERIFICATION" | "PASSWORD_RESET" | "PASSWORD_CHANGE";
  email: string;
  payload: { name: string; link?: string; date?: string };
}

const EMAIL_SUBJECTS = {
  VERIFICATION: "Verify Your ArtChain Account",
  PASSWORD_RESET: "Password Reset Request",
  PASSWORD_CHANGE: "Password Change Confirmation",
};

async function startEmailConsumer() {
  let connection, channel;
  const maxRetries = 20; // Increased retries
  const delay = 5000; // Increased delay to 5 seconds
  let currentRetry = 0;

  while (currentRetry < maxRetries) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();
      console.log("Successfully connected to RabbitMQ.");
      break;
    } catch (err) {
      console.error(
        `Attempt ${
          currentRetry + 1
        } failed to connect to RabbitMQ. Retrying in ${delay / 1000} seconds...`
      );
      currentRetry++;
      if (currentRetry === maxRetries) {
        console.error(
          "Unable to connect to RabbitMQ after multiple attempts. Exiting."
        );
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  if (!connection || !channel) {
    console.error("Failed to establish a connection to RabbitMQ.");
    process.exit(1);
  }

  const queue = "emails";
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (!msg) return;
    const message: EmailMessage = JSON.parse(msg.content.toString());
    const { type, email, payload } = message;

    try {
      const baseTemplate = fs.readFileSync(
        path.join(TEMPLATES_DIR, "base.html"),
        "utf-8"
      );
      const contentTemplate = fs.readFileSync(
        path.join(TEMPLATES_DIR, `${type.toLowerCase()}.html`),
        "utf-8"
      );

      let finalContent = contentTemplate;
      Object.entries(payload).forEach(([k, v]) => {
        finalContent = finalContent.replace(
          new RegExp(`\\{\\{${k}\\}\\}`, "g"),
          v
        );
      });

      const html = baseTemplate.replace(
        /\{\{CONTENT_PLACEHOLDER\}\}/g,
        finalContent
      );
      await sendEmail({ to: email, subject: EMAIL_SUBJECTS[type], html });
      channel.ack(msg);
    } catch (err) {
      console.error(err);
      channel.nack(msg);
    }
  });
}

export { startEmailConsumer };
