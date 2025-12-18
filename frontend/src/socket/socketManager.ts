import { Socket } from "socket.io-client";
import { disconnectSocket } from "./index";

let notificationSocket: Socket | null = null;
let chatSocket: Socket | null = null;
let biddingSocket: Socket | null = null;

type SocketListener = (socket: Socket) => void;
const chatSocketListeners: SocketListener[] = [];

export const setNotificationSocket = (s: Socket) => { notificationSocket = s; };

export const setChatSocket = (s: Socket) => { 
    chatSocket = s; 
    chatSocketListeners.forEach(listener => listener(s));
};

export const setBiddingSocket = (s: Socket) => { biddingSocket = s; };

export const onChatSocketAvailable = (listener: SocketListener) => {
    if (chatSocket) {
        listener(chatSocket);
    }
    chatSocketListeners.push(listener);
    return () => {
        const index = chatSocketListeners.indexOf(listener);
        if (index > -1) chatSocketListeners.splice(index, 1);
    };
};

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
