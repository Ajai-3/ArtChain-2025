import app from './app';
import http from 'http';
import { config } from './infrastructure/config/env';
import { createDummyUsers } from './test/createDummyUsers';
import { startConsumers } from './infrastructure/messaging/consumers';
const PORT = config.port;

const server = http.createServer(app);


// const DELAY_MS = 20000;

// setTimeout(async () => {
//   try {
//     console.log("Starting dummy users creation...");
//     await createDummyUsers();
//     console.log("Dummy users created!");
//   } catch (err) {
//     console.error("Error creating dummy users:", err);
//   }
// }, DELAY_MS);

await startConsumers()

server.listen(PORT, () => {
    console.log(`User-Admin Service starts on port ${PORT}`);
});