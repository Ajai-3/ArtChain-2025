export const MediaType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  CALL_LOG: "CALL_LOG",
} as const;

export const DeleteMode = {
  NONE: "NONE",
  ME: "ME",
  ALL: "ALL",
} as const;

export const CallStatus = {
  MISSED: "MISSED",
  ENDED: "ENDED",
  STARTED: "STARTED",
  DECLINED: "DECLINED",
} as const;

export type DeleteMode = (typeof DeleteMode)[keyof typeof DeleteMode];
export type MediaType = (typeof MediaType)[keyof typeof MediaType];
export type CallStatus = (typeof CallStatus)[keyof typeof CallStatus];

export class Message {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly senderId: string,
    public readonly content: string,
    public readonly mediaType?: MediaType,
    public readonly mediaUrl?: string,
    public readonly readBy: string[] = [],
    public readonly deleteMode: DeleteMode = DeleteMode.NONE,
    public readonly deletedAt?: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly callId?: string,
    public readonly callStatus?: CallStatus,
    public readonly callDuration?: number
  ) {}
}
