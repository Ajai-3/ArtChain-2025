import { config } from "../infrastructure/config/env";

export const mapCdnUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path; // Already a full URL
  const cdn = config.cdn_domain;
  
  // Ensure we don't double slash if cdn ends with / or path starts with /
  const cleanCdn = cdn.endsWith('/') ? cdn.slice(0, -1) : cdn;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Most CDN domains are just the domain name, but some might include protocol
  const protocol = cleanCdn.startsWith('http') ? '' : 'https://';
  
  return `${protocol}${cleanCdn}${cleanPath}`;
};
