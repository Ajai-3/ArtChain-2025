import AWS from 'aws-sdk';
import { config } from '../infrastructure/config/env';

export const createSignedUrl = (url: string, expiresInMinutes: number = 1440): string => {
  const signer = new AWS.CloudFront.Signer(
    config.aws.cloudfront_key_pair_id,
    config.aws.cloudfront_private_key
  );

  const expiresAt = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;

  const signedUrl = signer.getSignedUrl({
    url,
    expires: expiresAt,
  });

  return signedUrl;
};
