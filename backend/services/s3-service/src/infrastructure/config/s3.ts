import AWS from 'aws-sdk';
import { config } from './env';

const getBucketConfig = (category: 'profile' | 'banner' | 'art' | 'background' | 'chat' | 'bidding' | 'commission') => {
  if (category === 'art') {
    return {
      privateBucket: config.aws.art_bucket_private!,
      publicBucket: config.aws.art_bucket_public!,
      acl: config.aws.art_acl!,
    };
  }
  if (category === 'chat') {
    return {
      bucket: config.aws.chat_bucket!,
      acl: config.aws.upload_acl!, 
    };
  }
  if (category === 'bidding') {
    return {
       bucket: config.aws.bidding_bucket!,
       acl: config.aws.upload_acl!,
    };
  }
  if (category === 'commission') {
    return {
      bucket: config.aws.commission_bucket!,
      acl: config.aws.upload_acl!,
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
  signatureVersion: 'v4',
});

export { getBucketConfig };
