import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (token: string, backendUrl: string) => {
  if (socket) return socket;
  socket = io(backendUrl, { auth: { token } });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
