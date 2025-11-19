import { useEffect, type ReactNode } from "react";
import { initSocket, disconnectSocket } from "../../socket";
import { registerChatSocketEvents, registerNotificationSocketEvents } from "../../socket/socketEvents";
import {
  setNotificationSocket,
  setChatSocket,
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

    // Save them in manager so they can be disconnected later
    setNotificationSocket(notificationSocket);
    setChatSocket(chatSocket);

     registerNotificationSocketEvents(notificationSocket);
     registerChatSocketEvents(chatSocket);

    return () => {
      disconnectSocket(notificationSocket);
      disconnectSocket(chatSocket);
    };
  }, [accessToken]);

  return <>{children}</>;
};
