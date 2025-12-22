import { useRef, useState, useCallback } from 'react';
import { getChatSocket } from '../socket/socketManager';

export const useWebRTC = () => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const socket = getChatSocket();

  const createPeerConnection = useCallback((targetUserId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('call:signal', {
          to: targetUserId,
          signal: { type: 'candidate', candidate: event.candidate }
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track");
      setRemoteStream(event.streams[0]);
    };

    peerConnection.current = pc;
    return pc;
  }, [socket]);

  const addLocalStream = useCallback((stream: MediaStream) => {
    if (peerConnection.current) {
      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });
    }
  }, []);

  const handleSignal = useCallback(async (signal: any, fromUserId: string) => {
    if (!peerConnection.current) {
        // If receiving offer and no PC exists, create one (handled in Context usually, but safety check)
        // Actually context should create PC before calling this if it's accepting
        return;
    }

    const pc = peerConnection.current;

    if (signal.type === 'offer') {
      await pc.setRemoteDescription(new RTCSessionDescription(signal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket?.emit('call:signal', {
        to: fromUserId,
        signal: answer
      });
    } else if (signal.type === 'answer') {
      await pc.setRemoteDescription(new RTCSessionDescription(signal));
    } else if (signal.type === 'candidate') {
      await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
    }
  }, [socket]);

  const closeConnection = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setRemoteStream(null);
  }, []);

  const replaceTrack = useCallback(async (newTrack: MediaStreamTrack) => {
    if (peerConnection.current) {
      const sender = peerConnection.current.getSenders().find(s => s.track?.kind === newTrack.kind);
      if (sender) {
        await sender.replaceTrack(newTrack);
      }
    }
  }, []);

  return {
    createPeerConnection,
    addLocalStream,
    handleSignal,
    closeConnection,
    replaceTrack,
    remoteStream
  };
};
