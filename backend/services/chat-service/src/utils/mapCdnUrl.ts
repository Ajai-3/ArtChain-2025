import { env } from '../infrastructure/config/env';

export const mapCdnUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;

  const cdn = env.aws_cdn_domain;
  if (path.startsWith('http') || path.includes(cdn)) {
    return path;
  }

  return `${cdn}/${path}`;
};