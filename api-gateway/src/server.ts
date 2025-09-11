import http from "http";
import app from "./app";
import { config } from "./config/env";

const PORT = config.port;

const server = http.createServer(app);


server.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
