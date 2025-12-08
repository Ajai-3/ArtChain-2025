import { env } from "../infrastructure/config/env";

export const mapCdnUrl = (path?: string | null): string | undefined => {
  const cdn = env.aws_cdn_domain;
  return path ? `${cdn}/${path}` : undefined;
};
