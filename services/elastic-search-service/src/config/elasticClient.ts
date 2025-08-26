import { Client } from "@elastic/elasticsearch";

export const elasticClient = new Client({
  node: process.env.ELASTIC_URL || "http://localhost:9200",
});
