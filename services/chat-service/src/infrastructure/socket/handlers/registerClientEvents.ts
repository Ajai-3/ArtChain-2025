import { TYPES } from "../../Inversify/types";
import container from "../../Inversify/Inversify.config";
import { IClientEventHandler } from "../interface/IClientEventHandler";

export const registerClientEvents = (
  socket: any,
  onlineUsers: Map<string, string>
) => {
  const handler = container.get<IClientEventHandler>(TYPES.IClientEventHandler);

  socket.on("typing", handler.typing);
  socket.on("sendMessage", handler.sendMessage);
  socket.on("deleteMessage", handler.deleteMessage);
  socket.on("convoOpened", handler.convoOpened);
};
