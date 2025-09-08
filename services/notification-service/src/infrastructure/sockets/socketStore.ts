const userSocketMap = new Map<string, string>();

export const socketStore = {
  add: (userId: string, socketId: string) => {
    userSocketMap.set(userId, socketId);
  },

  remove: (userId: string) => {
    userSocketMap.delete(userId);
  },

  getSocketId: (userId: string): string | undefined => {
    return userSocketMap.get(userId);
  },

  getOnlineUsers: (): { userId: string; socketId: string }[] => {
    return Array.from(userSocketMap.entries()).map(([userId, socketId]) => ({
      userId,
      socketId,
    }));
  },
};
