import { getRabbitChannel } from "../../rabbitmq";
import { setupNotificationQueues } from "../../queueSetup";
import { sendEmail } from "../../../../presentation/services/email/email.service";
import { getTemplateFromS3 } from "../../../utils/s3";

const EMAIL_SUBJECTS = {
  VERIFICATION: "Verify Your ArtChain Account",
  PASSWORD_RESET: "Password Reset Request",
  PASSWORD_CHANGE: "Password Change Confirmation",
};
type EmailType = keyof typeof EMAIL_SUBJECTS;

export async function startEmailConsumer() {
  const ch = await getRabbitChannel();
  await setupNotificationQueues(ch);

  ch.consume("emails", async (msg) => {
    if (!msg) return;
    try {
      const parsed = JSON.parse(msg.content.toString());
      const type = parsed.type as EmailType;
      const email: string = parsed.email;
      const payload: Record<string, any> = parsed.payload;

      const baseTemplate = await getTemplateFromS3("base");
      const contentTemplate = await getTemplateFromS3(type.toLowerCase());

      let finalContent = contentTemplate;
      Object.entries(payload).forEach(([k, v]) => {
        finalContent = finalContent.replace(
          new RegExp(`\\{\\{${k}\\}\\}`, "g"),
          String(v)
        );
      });

      const html = baseTemplate.replace(
        "{{CONTENT_PLACEHOLDER}}",
        finalContent
      );

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
