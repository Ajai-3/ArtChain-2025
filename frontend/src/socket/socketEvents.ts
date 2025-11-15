import { store } from "../redux/store";
import { Socket } from "socket.io-client";
import {
  addNotification,
  setUnreadCount,
} from "../redux/slices/notificationSlice";

export const registerSocketEvents = (
  socket: Socket,
  type: "notification" | "chat"
) => {
  socket.on("connect", () =>
    console.log(`✅ ${type} socket connected:`, socket.id)
  );

  if (type === "notification") {
    socket.on("notification", (data) => {
      console.log("🔔 Notification received:", data);
      store.dispatch(addNotification(data));
    });

    socket.on("onlineUsers", (users: string[]) => {
      console.log("👥 Online users:", users);
    });


    socket.on("unreadCount", (count: number) => {
      store.dispatch(setUnreadCount(count));
    });
  }

  socket.on("chatOnline", (users: string[]) => {
    console.log("👥 Online users in chat socket:", users);
  });

  socket.on("connect_error", (err) =>
    console.error(`❌ ${type} socket error:`, err.message)
  );
};

// export const registerSocketEvents = (socket: Socket) => {
//   socket.on("connect", () => console.log("✅ Socket connected:", socket.id));

//   socket.on("notification", (data) => {
//     console.log("🔔 Notification received:", data);
//     store.dispatch(addNotification(data));
//   });

//    socket.on("unreadCount", (count: number) => {
//       store.dispatch(setUnreadCount(count));
//     });

//   socket.on("onlineUsers", (users: string[]) => {
//     console.log("👥 Online users:", users);
//   });

//   socket.on("connect_error", (err) => console.error("❌ Socket error:", err.message));
// };
