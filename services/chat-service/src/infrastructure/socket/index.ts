import { Server } from "socket.io";
import { env } from "../config/env";
import { chatSocket } from "./chatSocket";
import { redisPub, redisSub } from "../config/redis";
import { createAdapter } from "@socket.io/redis-adapter";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: env.frontend_url },
  });

  io.adapter(createAdapter(redisPub, redisSub));
  chatSocket(io);

  return io;
};
