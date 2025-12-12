import { useEffect, type ReactNode } from "react";
import { initSocket, disconnectSocket } from "../../socket";
import { registerChatSocketEvents, registerNotificationSocketEvents, registerBiddingSocketEvents } from "../../socket/socketEvents";
import {
  setNotificationSocket,
  setChatSocket,
  setBiddingSocket,
} from "../../socket/socketManager";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const accessToken = useSelector(
    (state: RootState) => state.admin.accessToken || state.user.accessToken
  );

  useEffect(() => {
    if (!accessToken) return;

    const notificationSocket = initSocket(accessToken, "http://localhost:4005");
    const chatSocket = initSocket(accessToken, "http://localhost:4007");
    const biddingSocket = initSocket(accessToken, import.meta.env.VITE_ART_SERVICE_URL || "http://localhost:4002");

    setNotificationSocket(notificationSocket);
    setChatSocket(chatSocket);
    setBiddingSocket(biddingSocket);

     registerNotificationSocketEvents(notificationSocket);
     registerChatSocketEvents(chatSocket);
     registerBiddingSocketEvents(biddingSocket);

    return () => {
      disconnectSocket(notificationSocket);
      disconnectSocket(chatSocket);
      disconnectSocket(biddingSocket);
    };
  }, [accessToken]);

  return <>{children}</>;
};
