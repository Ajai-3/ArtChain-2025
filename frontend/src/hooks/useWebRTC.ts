import { useRef, useState, useCallback } from 'react';
import { getChatSocket } from '../socket/socketManager';

export const useWebRTC = () => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const candidateQueue = useRef<any[]>([]);
  const socket = getChatSocket();

  const createPeerConnection = useCallback((targetUserId: string) => {
    console.log("[useWebRTC] Creating new PeerConnection for:", targetUserId);
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
        console.log("[useWebRTC] New ICE candidate gathered.");
        socket.emit('call:signal', {
          to: targetUserId,
          signal: { type: 'candidate', candidate: event.candidate }
        });
      }
    };

    pc.ontrack = (event) => {
      console.log(`[useWebRTC] Received remote track: ${event.track.kind}. Streams provided: ${event.streams.length}`);
      
      // Preferred way: use the stream provided by the browser (Unified Plan)
      if (event.streams && event.streams[0]) {
        console.log("[useWebRTC] Assigning browser-provided stream.");
        // We only update if the stream reference is actually different
        setRemoteStream(prev => (prev?.id === event.streams[0].id ? prev : event.streams[0]));
      } else {
        // Fallback for older browsers or specific cases: build stream manually
        console.warn("[useWebRTC] No stream in event, adding track to manual stream.");
        setRemoteStream(prev => {
          const stream = prev || new MediaStream();
          const existingTracks = stream.getTracks();
          if (!existingTracks.some(t => t.id === event.track.id)) {
            stream.addTrack(event.track);
            // We MUST return a new reference for React, but using same tracks
            return new MediaStream(stream.getTracks());
          }
          return prev;
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
        console.log("[useWebRTC] ICE Connection State:", pc.iceConnectionState);
    };

    peerConnection.current = pc;
    return pc;
  }, [socket]);

  const addLocalStream = useCallback((stream: MediaStream) => {
    console.log("[useWebRTC] Adding local stream tracks to PC.");
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
    
    console.log(`[useWebRTC] Processing ${candidateQueue.current.length} queued candidates.`);
    while (candidateQueue.current.length > 0) {
      const candidate = candidateQueue.current.shift();
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("[useWebRTC] Error adding queued candidate:", err);
      }
    }
  }, []);

  const handleSignal = useCallback(async (signal: any, fromUserId: string) => {
    if (!peerConnection.current) {
      console.warn("[useWebRTC] Received signal but peerConnection is not initialized.");
      if (signal.type === 'candidate') {
          candidateQueue.current.push(signal.candidate);
      }
      return;
    }

    const pc = peerConnection.current;

    try {
      if (signal.type === 'offer') {
        console.log("[useWebRTC] Processing offer.");
        await pc.setRemoteDescription(new RTCSessionDescription(signal));
        await processCandidateQueue();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket?.emit('call:signal', {
          to: fromUserId,
          signal: answer
        });
      } else if (signal.type === 'answer') {
        console.log("[useWebRTC] Processing answer.");
        await pc.setRemoteDescription(new RTCSessionDescription(signal));
        await processCandidateQueue();
      } else if (signal.type === 'candidate') {
        if (pc.remoteDescription && pc.remoteDescription.type) {
          await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        } else {
          console.log("[useWebRTC] Queuing candidate (SDP not yet set).");
          candidateQueue.current.push(signal.candidate);
        }
      }
    } catch (err) {
      console.error("[useWebRTC] Error handling signal:", err);
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
