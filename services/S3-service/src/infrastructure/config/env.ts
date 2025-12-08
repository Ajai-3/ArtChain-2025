import dontenv from "dotenv";
dontenv.config();

export const config = {
  port: process.env.PORT,
  rabbitmq_URL: process.env.RABBITMQ_URL || "",
  aws: {
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    upload_bucket: process.env.AWS_UPLOAD_BUCKET!,
    upload_acl: process.env.AWS_UPLOAD_ACL!,
    art_bucket_private: process.env.AWS_ART_BUCKET_PRIVATE!,
    art_bucket_public: process.env.AWS_ART_BUCKET_PUBLIC!,
    art_acl: process.env.AWS_ART_ACL!,
    chat_bucket: process.env.AWS_CHAT_BUCKET!,
    cdn_domain: process.env.AWS_CDN_DOMAIN!,
  },
};
