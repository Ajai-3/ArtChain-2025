import http from "http";
import app from "./app";
import { config } from "./infrastructure/config/env";

const PORT = config.port;

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`Upload service running in port ${PORT}`)
})