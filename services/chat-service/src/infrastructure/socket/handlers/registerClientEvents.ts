import { Socket } from "socket.io";
import { TYPES } from "../../Inversify/types";
import container from "../../Inversify/Inversify.config";
import { IClientEventHandler } from "../interface/IClientEventHandler";
import { CallHandler } from "./CallHandler";
import { ISendMessageUseCase } from "../../../applications/interface/usecase/ISendMessageUseCase";
import { IUpdateCallMessageUseCase } from "../../../applications/interface/usecase/IUpdateCallMessageUseCase";

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
  socket.on("markMessagesRead", (payload) =>
    handler.markMessagesRead(socket, payload)
  );

  // Call Events
  const sendMessageUseCase = container.get<ISendMessageUseCase>(TYPES.ISendMessageUseCase);
  const updateCallMessageUseCase = container.get<IUpdateCallMessageUseCase>(TYPES.IUpdateCallMessageUseCase);
  const callHandler = new CallHandler(sendMessageUseCase, updateCallMessageUseCase, onlineUsers);

  socket.on("call:initiate", (payload) => callHandler.initiateCall(socket, payload));
  socket.on("call:accept", (payload) => callHandler.acceptCall(socket, payload));
  socket.on("call:reject", (payload) => callHandler.rejectCall(socket, payload));
  socket.on("call:end", (payload) => callHandler.endCall(socket, payload));
  socket.on("call:signal", (payload) => callHandler.signal(socket, payload));
};
