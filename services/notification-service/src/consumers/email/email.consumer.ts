import { getRabbitChannel } from "../../lib/rabbitmq";
import { setupQueueWithDLQ } from "../../lib/queue";
import { sendEmail } from "../../services/email/email.service";
import fs from "fs";
import path from "path";
import { getTemplateFromS3 } from "../../lib/s3";

const TEMPLATES_DIR = path.join(__dirname, "../email-templates");

const EMAIL_SUBJECTS = {
  VERIFICATION: "Verify Your ArtChain Account",
  PASSWORD_RESET: "Password Reset Request",
  PASSWORD_CHANGE: "Password Change Confirmation",
};

export async function startEmailConsumer() {
  const ch = await getRabbitChannel();
  await setupQueueWithDLQ(ch, "emails");

  ch.consume("emails", async (msg) => {
    if (!msg) return;

    try {
      const { type, email, payload } = JSON.parse(msg.content.toString());

      // const baseTemplate = fs.readFileSync(
      //   path.join(TEMPLATES_DIR, "base.html"),
      //   "utf-8"
      // );
      // const contentTemplate = fs.readFileSync(
      //   path.join(TEMPLATES_DIR, `${type.toLowerCase()}.html`),
      //   "utf-8"
      // );

      const baseTemplate = await getTemplateFromS3("base")
      const contentTemplate = await getTemplateFromS3(type.toLowerCase())

      let finalContent = contentTemplate;
      Object.entries(payload).forEach(([k, v]) => {
        finalContent = finalContent.replace(
          new RegExp(`\\{\\{${k}\\}\\}`, "g"),
          String(v)
        );
      });

      const html = baseTemplate.replace("{{CONTENT_PLACEHOLDER}}", finalContent);

      await sendEmail({ to: email, subject: EMAIL_SUBJECTS[type], html });
      console.log(`✅ Email sent successfully to ${email}`);
      ch.ack(msg);
    } catch (err) {
      console.error("❌ Failed to process email message:", err);
      ch.nack(msg, false, false);
    }
  });

  console.log("📩 Listening on queue: emails");
}
