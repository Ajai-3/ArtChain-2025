import { config } from '../config/env';

export const mapCdnUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;

  const cdn = config.aws_cdn_domain;

  if (path.startsWith('http') || path.includes(cdn)) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.substring(1) : path;

  const cleanCdn = cdn.endsWith('/') ? cdn.slice(0, -1) : cdn;

  return `${cleanCdn}/${cleanPath}`;
};
