import { Socket } from "socket.io-client";
import { disconnectSocket } from "./index";

let notificationSocket: Socket | null = null;
let chatSocket: Socket | null = null;
let biddingSocket: Socket | null = null;

export const setNotificationSocket = (s: Socket) => { notificationSocket = s; };
export const setChatSocket = (s: Socket) => { chatSocket = s; };
export const setBiddingSocket = (s: Socket) => { biddingSocket = s; };

export const disconnectSockets = () => {
  if (notificationSocket) disconnectSocket(notificationSocket);
  if (chatSocket) disconnectSocket(chatSocket);
  if (biddingSocket) disconnectSocket(biddingSocket);

  notificationSocket = null;
  chatSocket = null;
  biddingSocket = null;
};

export const getNotificationSocket = () => notificationSocket;
export const getChatSocket = () => chatSocket;
export const getBiddingSocket = () => biddingSocket;
