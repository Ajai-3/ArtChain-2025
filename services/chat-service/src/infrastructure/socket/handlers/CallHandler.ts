import { Socket } from "socket.io";
import { ISendMessageUseCase } from "../../../applications/interface/usecase/ISendMessageUseCase";
import { SendMessageDto } from "../../../applications/interface/dto/SendMessageDto";
import { MediaType, CallStatus } from "../../../domain/entities/Message";
import { IUpdateCallMessageUseCase } from "../../../applications/interface/usecase/IUpdateCallMessageUseCase";

export class CallHandler {
  constructor(
    private readonly _sendMessageUseCase: ISendMessageUseCase,
    private readonly _updateCallMessageUseCase: IUpdateCallMessageUseCase,
    private readonly onlineUsers: Map<string, string>
  ) {}

  initiateCall = async (socket: Socket, payload: { receiverId: string; conversationId: string; isGroup: boolean; callerName?: string; callerProfileImage?: string; callId?: string }) => {
    const senderId = socket.data.userId;
    console.log(`📞 Call initiated by ${senderId} to ${payload.receiverId} in ${payload.conversationId}`);

    // Create "Call Started" message
    const messageDto: SendMessageDto = {
      conversationId: payload.conversationId,
      senderId,
      receiverId: payload.receiverId,
      content: "Call started",
      mediaType: MediaType.CALL_LOG,
      callId: payload.callId || `${payload.conversationId}-${Date.now()}`,
      callStatus: CallStatus.STARTED,
    };

    try {
      await this._sendMessageUseCase.execute(messageDto);
      
      // Notify receiver
      const incomingCallPayload = {
        callerId: senderId,
        callerName: payload.callerName,
        callerProfileImage: payload.callerProfileImage,
        conversationId: payload.conversationId,
        callId: messageDto.callId,
        isGroup: payload.isGroup
      };

      if (payload.isGroup) {
         socket.to(payload.conversationId).emit("call:incoming", incomingCallPayload);
      } else {
         const receiverSocketId = this.onlineUsers.get(payload.receiverId);
         if (receiverSocketId) {
            socket.to(receiverSocketId).emit("call:incoming", incomingCallPayload);
         }
      }
    } catch (error) {
      console.error("Error initiating call:", error);
    }
  };

  acceptCall = async (socket: Socket, payload: { callerId: string; callId: string; conversationId: string }) => {
      const userId = socket.data.userId;
      console.log(`✅ Call accepted by ${userId}`);
      
      // Notify caller
      const callerSocketId = this.onlineUsers.get(payload.callerId);
      if (callerSocketId) {
          socket.to(callerSocketId).emit("call:accepted", {
              accepterId: userId,
              callId: payload.callId
          });
      }
      
      // For group calls, we might broadcast to room
      socket.to(payload.conversationId).emit("call:accepted", {
          accepterId: userId,
          callId: payload.callId
      });
  };

  rejectCall = async (socket: Socket, payload: { callerId: string; callId: string; conversationId: string }) => {
      const userId = socket.data.userId;
      console.log(`❌ Call rejected by ${userId}`);
      
      try {
          await this._updateCallMessageUseCase.execute(payload.callId, {
              callStatus: CallStatus.DECLINED,
              content: "Call declined"
          });
      } catch (error) {
          console.error("Error setting call to missed:", error);
      }

      // Notify caller
      const callerSocketId = this.onlineUsers.get(payload.callerId);
      if (callerSocketId) {
          socket.to(callerSocketId).emit("call:rejected", {
              rejecterId: userId,
              callId: payload.callId
          });
      }
  };

  endCall = async (socket: Socket, payload: { conversationId: string; callId: string; duration?: number; to?: string }) => {
      const userId = socket.data.userId;
      console.log(`🏁 Call ended by ${userId}`);

      const duration = payload.duration || 0;
      const status = duration > 0 ? CallStatus.ENDED : CallStatus.MISSED;
      const content = duration > 0 ? "Call ended" : "Missed call";

      try {
          // Update existing message
          await this._updateCallMessageUseCase.execute(payload.callId, {
              callStatus: status,
              callDuration: duration,
              content: content
          });

          const endPayload = {
              enderId: userId,
              callId: payload.callId
          };

          socket.to(payload.conversationId).emit("call:ended", endPayload);
          
          if (payload.to) {
              const receiverSocketId = this.onlineUsers.get(payload.to);
              if (receiverSocketId) {
                  socket.to(receiverSocketId).emit("call:ended", endPayload);
              }
          }
      } catch (error) {
          console.error("Error ending call:", error);
      }
  };

  signal = (socket: Socket, payload: { to: string; signal: any }) => {
      const senderId = socket.data.userId;
      console.log(`[CallHandler] 📡 Signal from ${senderId} to ${payload.to}`);
      
      const receiverSocketId = this.onlineUsers.get(payload.to);
      if (receiverSocketId) {
          socket.to(receiverSocketId).emit("call:signal", {
              from: senderId,
              signal: payload.signal
          });
      } else {
          console.warn(`[CallHandler] Signal target ${payload.to} is OFFLINE`);
      }
  };
}
