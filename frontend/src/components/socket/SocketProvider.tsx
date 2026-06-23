import { useSelector } from 'react-redux';
import { useEffect, type ReactNode } from 'react';
import type { RootState } from '../../redux/store';
import { initSocket, disconnectSocket } from '../../socket';
import {
  registerChatSocketEvents,
  registerNotificationSocketEvents,
  registerBiddingSocketEvents,
} from '../../socket/socketEvents';
import {
  setNotificationSocket,
  setChatSocket,
  setBiddingSocket,
} from '../../socket/socketManager';

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const accessToken = useSelector(
    (state: RootState) => state.admin.accessToken || state.user.accessToken,
  );

  useEffect(() => {
    if (!accessToken) return;

    const notificationSocket = initSocket(
      accessToken,
      import.meta.env.VITE_API_URL,
      '/socket.io/notification',
    );
    const chatSocket = initSocket(
      accessToken,
      import.meta.env.VITE_API_URL,
      '/socket.io/chat',
    );
    const biddingSocket = initSocket(
      accessToken,
      import.meta.env.VITE_API_URL,
      '/socket.io/bidding',
    );

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
