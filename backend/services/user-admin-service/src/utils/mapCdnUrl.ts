import { config } from '../infrastructure/config/env';

export const mapCdnUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  const cdn = config.aws_cdn_domain;

  const cleanCdn = cdn.endsWith('/') ? cdn.slice(0, -1) : cdn;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  const protocol = cleanCdn.startsWith('http') ? '' : 'https://';

  return `${protocol}${cleanCdn}${cleanPath}`;
};
