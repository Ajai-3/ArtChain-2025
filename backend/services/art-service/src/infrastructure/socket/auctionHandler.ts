import { Server, Socket } from 'socket.io';

const globalOnlineUsers = new Set<string>();

export const registerAuctionEvents = (io: Server, socket: Socket) => {
  const userId = socket.data.userId;

  // Track global online users
  if (userId) {
    globalOnlineUsers.add(userId);
    io.emit('global_online_count', globalOnlineUsers.size);
  }

  socket.on('join_auction', (auctionId: string) => {
    const roomName = `auction:${auctionId}`;
    socket.join(roomName);

    updateRoomUsers(io, roomName);
  });

  socket.on('leave_auction', (auctionId: string) => {
    const roomName = `auction:${auctionId}`;
    socket.leave(roomName);

    updateRoomUsers(io, roomName);
  });

  socket.on('disconnect', () => {
    if (userId) {
      globalOnlineUsers.delete(userId);
      io.emit('global_online_count', globalOnlineUsers.size);
    }
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      if (room.startsWith('auction:')) {
        const currentSize = io.sockets.adapter.rooms.get(room)?.size || 0;
        const nextSize = Math.max(0, currentSize - 1);
        io.to(room).emit('active_users', nextSize);
      }
    });
  });
};

const updateRoomUsers = (io: Server, roomName: string) => {
  const count = io.sockets.adapter.rooms.get(roomName)?.size || 0;
  io.to(roomName).emit('active_users', count);
};
