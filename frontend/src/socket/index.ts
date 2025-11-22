import { io, Socket } from "socket.io-client";

export const initSocket = (token: string, backendUrl: string): Socket => {
  const socket = io(backendUrl, {
    auth: { token },
    transports: ["websocket"],
  });
  return socket;
};

export const disconnectSocket = (socket: Socket) => {
  if (socket.connected) {
    socket.disconnect();
  }
};
