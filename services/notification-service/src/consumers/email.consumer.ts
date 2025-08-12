import amqp from "amqplib";
import { sendEmail } from "../services/email/email.service";
import path from "path";
import fs from "fs";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const TEMPLATES_DIR = path.join(__dirname, "../email-templates");

interface EmailMessage {
  type: "VERIFICATION" | "PASSWORD_RESET" | "PASSWORD_CHANGE";
  email: string;
  payload: {
    name: string;
    link?: string;
    date?: string;
  };
}

const EMAIL_SUBJECTS = {
  VERIFICATION: "Verify Your ArtChain Account",
  PASSWORD_RESET: "Password Reset Request",
  PASSWORD_CHANGE: "Password Change Confirmation",
};

async function startEmailConsumer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = "emails";

    await channel.assertQueue(queue, { durable: true });

    console.log("Email consumer ready...");

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      const message: EmailMessage = JSON.parse(msg.content.toString());
      const { type, email, payload } = message;

      try {
        // base template
        const baseTemplate = fs.readFileSync(
          path.join(TEMPLATES_DIR, "base.html"),
          "utf-8"
        );

        // Loading content template
        const contentTemplate = fs.readFileSync(
          path.join(TEMPLATES_DIR, `${type.toLowerCase()}.html`),
          "utf-8"
        );

        // Replaceing placeholders in content
        let finalContent = contentTemplate;
        Object.entries(payload).forEach(([key, value]) => {
          finalContent = finalContent.replace(
            new RegExp(`\\{\\{${key}\\}\\}`, "g"),
            value
          );
        });

        // Insert content into base template
        const finalHtml = baseTemplate.replace(
          /\{\{CONTENT_PLACEHOLDER\}\}/g,
          finalContent
        );
        // Send email
        await sendEmail({
          to: email,
          subject: EMAIL_SUBJECTS[type],
          html: finalHtml,
        });

        channel.ack(msg);
        console.log(`Sent ${type} email to ${email}`);
      } catch (error) {
        console.error(`Failed to process ${type} email:`, error);
        channel.nack(msg);
      }
    });
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    process.exit(1);
  }
}

export { startEmailConsumer };
