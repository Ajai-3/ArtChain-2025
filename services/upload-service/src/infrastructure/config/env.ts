import dontenv from "dotenv";
dontenv.config();

export const config = {
  port: process.env.PORT,
  aws: {
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    upload_bucket: process.env.AWS_UPLOAD_BUCKET!,
    upload_acl: process.env.AWS_UPLOAD_ACL!,
    art_bucket: process.env.AWS_ART_BUCKET!,
    art_acl: process.env.AWS_ART_ACL!,
    cdn_domain: process.env.AWS_CDN_DOMAIN!,
  },
};
