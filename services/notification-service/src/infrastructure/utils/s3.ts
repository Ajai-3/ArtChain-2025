import AWS from "aws-sdk";
import { config } from "../../config/env";

const s3 = new AWS.S3({ region: "ap-south-1" });

export async function getTemplateFromS3(templateName: string): Promise<string> {
  const bucket = config.aws.email_template_bucket!;
  const key = `${templateName}.html`;

  try {
    const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    return data.Body?.toString("utf-8") ?? "";
  } catch (err) {
    console.error(`❌ Error fetching template ${templateName} from S3:`, err);
    throw err;
  }
}
