import app from "./app";
import http from "http";
import { config } from "./3-infrastructure/config/env";

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`User-Service is running on port ${config.port}...  ��`);
});
