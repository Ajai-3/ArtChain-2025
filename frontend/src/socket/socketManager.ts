import { Socket } from "socket.io-client";
import { disconnectSocket } from "./index";

let notificationSocket: Socket | null = null;
let chatSocket: Socket | null = null;

export const setNotificationSocket = (s: Socket) => { notificationSocket = s; };
export const setChatSocket = (s: Socket) => { chatSocket = s; };

export const disconnectSockets = () => {
  if (notificationSocket) disconnectSocket(notificationSocket);
  if (chatSocket) disconnectSocket(chatSocket);
  notificationSocket = null;
  chatSocket = null;
};

export const getNotificationSocket = () => notificationSocket;
export const getChatSocket = () => chatSocket;
