import { Server } from 'socket.io';
import http from 'http';
import { env } from '../config/env';
import { chatSocket } from './chatSocket';
import { redisPub, redisSub } from '../config/redis';
import { createAdapter } from '@socket.io/redis-adapter';

export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    path: '/socket.io/chat',
    cors: {
      origin: env.frontend_url,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });
  io.adapter(createAdapter(redisPub, redisSub));
  chatSocket(io);

  return io;
};
