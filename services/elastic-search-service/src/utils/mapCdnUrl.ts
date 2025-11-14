import { config } from "../config/env";

export const mapCdnUrl = (path?: string | null): string | undefined => {
  const cdn = config.aws_cdn_domain;
  return path ? `${cdn}/${path}` : undefined;
};
