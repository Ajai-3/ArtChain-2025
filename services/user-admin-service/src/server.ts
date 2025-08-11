import app from './app';
import http from 'http';
import { config } from './infrastructure/config/env';

const PORT = config.port;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`User-Admin Service starts on port ${PORT}`);
});