import { useEffect, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { initSocket } from "../../socket";
import { registerSocketEvents } from "../../socket/socketEvents";


interface Props {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: Props) => {
  const accessToken = useSelector((state: any) => state.user.accessToken);

  useEffect(() => {
    if (!accessToken) return;
    const socket = initSocket(accessToken, "http://localhost:4005");
    registerSocketEvents(socket);
  }, [accessToken]);

  return <>{children}</>;
};
