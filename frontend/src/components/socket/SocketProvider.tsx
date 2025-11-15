import { useSelector } from "react-redux";
import { useEffect, type ReactNode } from "react";
import { initSocket, disconnectSocket } from "../../socket";
import { registerSocketEvents } from "../../socket/socketEvents";
import { type RootState } from "../../redux/store";

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const accessToken = useSelector(
    (state: RootState) => state.admin.accessToken || state.user.accessToken
  );
  console.log("accessToken for socket: ", accessToken);

  useEffect(() => {
    console.log("🔁 SocketProvider re-rendered with token:", accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    console.log("🔌 Creating new sockets with token:", accessToken);

    const notificationSocket = initSocket(accessToken, "http://localhost:4005");
    const chatSocket = initSocket(accessToken, "http://localhost:4007");

    registerSocketEvents(notificationSocket, "notification");
    registerSocketEvents(chatSocket, "chat");

    return () => {
      disconnectSocket(notificationSocket);
      disconnectSocket(chatSocket);
    };
  }, [accessToken]);

  return <>{children}</>;
};
