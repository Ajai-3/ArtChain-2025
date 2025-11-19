import { Socket } from "socket.io";
import { TYPES } from "../../Inversify/types";
import container from "../../Inversify/Inversify.config";
import { IClientEventHandler } from "../interface/IClientEventHandler";

export const registerClientEvents = (
  socket: Socket,
  onlineUsers: Map<string, string>
) => {
  const handler = container.get<IClientEventHandler>(TYPES.IClientEventHandler);

  socket.on("typing", (data) => handler.typing(socket, data));
  socket.on("sendMessage", (payload, callback) =>
    handler.sendMessage(socket, payload, callback)
  );
  socket.on("deleteMessage", (payload, callback) =>
    handler.deleteMessage(socket, payload, callback)
  );
  socket.on("convoOpened", (payload) => handler.convoOpened(socket, payload));
};
