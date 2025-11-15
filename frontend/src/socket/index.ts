import { io, Socket } from "socket.io-client";

export const initSocket = (token: string, backendUrl: string): Socket => {
  const socket = io(backendUrl, { auth: { token } });
  return socket;
};

export const disconnectSocket = (socket: Socket) => {
  socket.disconnect();
};

// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export const initSocket = (token: string, backendUrl: string) => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }

//   socket = io(backendUrl, { auth: { token } });
//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };

// export const getSocket = () => socket;
