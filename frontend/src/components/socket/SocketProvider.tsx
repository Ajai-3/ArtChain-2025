import { useSelector } from "react-redux";
import { useEffect, type ReactNode } from "react";
import { initSocket, disconnectSocket } from "../../socket";
import { registerSocketEvents } from "../../socket/socketEvents";

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const accessToken = useSelector((state: any) => state.user.accessToken);
  console.log("accessToken for socket: ", accessToken);

  useEffect(() => {
    if (!accessToken) return;

    // Initialize multiple socket connections
    // const notificationSocket = initSocket(accessToken, "http://localhost:4005");
    const chatSocket = initSocket(accessToken, "http://localhost:4007");

    // Register events for each socket
    // registerSocketEvents(notificationSocket, "notification");
    registerSocketEvents(chatSocket, "chat");

    console.log("Connected to both sockets");

    return () => {
      // disconnectSocket(notificationSocket);
      disconnectSocket(chatSocket);
    };
  }, [accessToken]);

  return <>{children}</>;
};
