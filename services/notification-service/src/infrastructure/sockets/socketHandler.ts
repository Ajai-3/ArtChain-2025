import { Server } from "socket.io";
import { socketStore } from "./socketStore";

let io: Server | null = null;

export function initSocketHandler(socketServer: Server) {
  io = socketServer;
}

export async function emitToUser(
  userId: string,
  event: string,
  payload: any
) {
  if (!io) throw new Error("Socket.io not initialized.");

  const socketId = socketStore.getSocketId(userId);
  if (socketId) {
    io.to(socketId).emit(event, payload);
  } else {
    console.warn(`⚠️ User ${userId} not connected, skipping socket emit`);
  }
}
