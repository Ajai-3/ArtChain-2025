import { config } from "./env";
import { Client } from "@elastic/elasticsearch";

export const elasticClient = new Client({
  node: config.elastic_url,
});
