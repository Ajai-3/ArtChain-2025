import { Socket } from 'socket.io';

export interface SocketPayload {
  [key: string]: unknown;
}

export interface AuthenticatedUser {
  id: string;
}

export interface AuthenticatedSocket extends Socket {
  userId: string;
}