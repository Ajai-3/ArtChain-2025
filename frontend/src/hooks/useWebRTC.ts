import { useRef, useState, useCallback } from 'react';
import 'webrtc-adapter';
import { getChatSocket } from '../socket/socketManager';

export interface RTCSignalWithType {
  type: RTCSdpType;
  sdp?: string;
}

export interface RTCIceSignal {
  type: 'candidate';
  candidate?: RTCIceCandidateInit;
}

export interface CallControlSignal {
  type: 'camera-toggle' | 'mic-toggle';
  enabled: boolean;
}

export type RTCSignal = RTCSignalWithType | RTCIceSignal | CallControlSignal;

export type RTCDirectSignal = RTCSignalWithType | RTCIceSignal;

export const useWebRTC = () => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const candidateQueue = useRef<RTCIceCandidateInit[]>([]);
  const socket = getChatSocket();

  const createPeerConnection = useCallback((targetUserId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:stun.services.mozilla.com' },
        { urls: 'stun:stun.cloudflare.com:3478' }
      ],
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
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
      if (event.streams && event.streams[0]) {
        setRemoteStream(new MediaStream(event.streams[0].getTracks()));
      } else {
        console.warn("[useWebRTC] No stream in event, adding track to manual stream.");
        setRemoteStream(prev => {
          const stream = prev || new MediaStream();
          const existingTracks = stream.getTracks();
          if (!existingTracks.some(t => t.id === event.track.id)) {
            stream.addTrack(event.track);
            return new MediaStream(stream.getTracks());
          }
          return prev;
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
    };

    peerConnection.current = pc;
    return pc;
  }, [socket]);

  const addLocalStream = useCallback((stream: MediaStream) => {
    if (peerConnection.current) {
      const currentSenders = peerConnection.current.getSenders();
      stream.getTracks().forEach(track => {
        const alreadyAdded = currentSenders.some(s => s.track && s.track.kind === track.kind);
        if (!alreadyAdded) {
           peerConnection.current?.addTrack(track, stream);
        }
      });
    }
  }, []);

  const processCandidateQueue = useCallback(async () => {
    if (!peerConnection.current || !peerConnection.current.remoteDescription) return;
    
    while (candidateQueue.current.length > 0) {
      const candidate = candidateQueue.current.shift();
      try {
        if (candidate) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.log(err)
      }
    }
  }, []);

  const handleSignal = useCallback(async (signal: RTCSignal, fromUserId: string) => {
    if (!peerConnection.current) {
      if (signal.type === 'candidate' && (signal as RTCIceSignal).candidate) {
          candidateQueue.current.push((signal as RTCIceSignal).candidate!);
      }
      return;
    }

    const pc = peerConnection.current;

    try {
      if (signal.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal as RTCSessionDescriptionInit));
        await processCandidateQueue();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket?.emit('call:signal', {
          to: fromUserId,
          signal: answer
        });
      } else if (signal.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal as RTCSessionDescriptionInit));
        await processCandidateQueue();
      } else if (signal.type === 'candidate') {
        const candidate = (signal as RTCIceSignal).candidate;
        if (candidate && pc.remoteDescription && pc.remoteDescription.type) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else if (candidate) {
          candidateQueue.current.push(candidate);
        }
      }
    } catch (err) {
      console.log(err)
    }
  }, [socket, processCandidateQueue]);

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
