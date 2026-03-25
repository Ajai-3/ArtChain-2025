import { io, Socket } from "socket.io-client";

export const initSocket = (token: string, backendUrl: string, path: string = "/socket.io"): Socket => {
  const socket = io(backendUrl, {
    auth: { token },
    transports: ["websocket"],
    path: path,
  });
  return socket;
};

export const disconnectSocket = (socket: Socket) => {
  if (socket.connected) {
    socket.disconnect();
  }
};
