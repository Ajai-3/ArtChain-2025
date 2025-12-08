import AWS from "aws-sdk";
import { config } from "./env";

const getBucketConfig = (category: "profile" | "banner" | "art" | "background" | "chat") => {
  if (category === "art") {
    return {
      privateBucket: config.aws.art_bucket_private!,
      publicBucket: config.aws.art_bucket_public!,
      acl: config.aws.art_acl!,
    };
  }
  if (category === "chat") {
    return {
      bucket: config.aws.chat_bucket!,
      acl: config.aws.upload_acl!, // Reusing upload ACL for now, or add specific one if needed
    };
  }
  return {
    bucket: config.aws.upload_bucket!,
    acl: config.aws.upload_acl!,
  };
};

export const s3Client = new AWS.S3({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});

export { getBucketConfig };
