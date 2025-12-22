import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getChatSocket, onChatSocketAvailable } from '../socket/socketManager';
import { useWebRTC } from '../hooks/useWebRTC';
import { useSFU } from '../hooks/useSFU';
import { useSelector } from 'react-redux';

interface CallState {
  status: 'IDLE' | 'INCOMING' | 'OUTGOING' | 'ACTIVE' | 'ENDING';
  type: 'PRIVATE' | 'GROUP';
  callId: string | null;
  conversationId: string | null;
  caller: { id: string; name?: string; profileImage?: string } | null;
  remoteUserId: string | null;
  remoteUserName: string | null;
  remoteUserProfile: string | null;
  isGroup: boolean;
}

interface VideoCallContextType {
  callState: CallState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  sfuParticipants: any[];
  audioInputs: MediaDeviceInfo[];
  startCall: (conversationId: string, receiverId: string, isGroup: boolean, receiverName?: string, receiverImage?: string) => Promise<void>;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  toggleMic: () => void;
  toggleCamera: () => void;
  switchAudioInput: (deviceId: string) => Promise<void>;
  isMicOn: boolean;
  isCameraOn: boolean;
  isRemoteMicOn: boolean;
  isRemoteCameraOn: boolean;
  callDuration: number;
  outgoingTimer: number;
}

const VideoCallContext = createContext<VideoCallContextType | null>(null);

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) throw new Error('useVideoCall must be used within a VideoCallProvider');
  return context;
};

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [callState, setCallState] = useState<CallState>({
    status: 'IDLE',
    type: 'PRIVATE',
    callId: null,
    conversationId: null,
    caller: null,
    remoteUserId: null,
    remoteUserName: null,
    remoteUserProfile: null,
    isGroup: false,
  });

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isRemoteMicOn, setIsRemoteMicOn] = useState(true);
  const [isRemoteCameraOn, setIsRemoteCameraOn] = useState(true);
  const [incomingOffer, setIncomingOffer] = useState<any>(null);
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [outgoingTimer, setOutgoingTimer] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const outgoingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { createPeerConnection, addLocalStream, handleSignal, closeConnection, remoteStream, replaceTrack } = useWebRTC();
  const { joinRoom, leaveRoom, participants: sfuParticipants } = useSFU();
  
  const [socket, setSocket] = useState<any>(null);
  // @ts-ignore
  const currentUser = useSelector((state: any) => state.user.user);

  useEffect(() => {
    const s = getChatSocket();
    if (s) setSocket(s);

    const cleanup = onChatSocketAvailable((s: any) => {
        console.log("VideoCallContext: Socket available", s.id);
        setSocket(s);
    });
    
    // Enumerate devices
    navigator.mediaDevices.enumerateDevices().then(devices => {
        setAudioInputs(devices.filter(d => d.kind === 'audioinput'));
    });

    return cleanup;
  }, []);

  // Timer Logic
  useEffect(() => {
    if (callState.status === 'ACTIVE') {
        const startTime = Date.now();
        timerRef.current = setInterval(() => {
            setCallDuration(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
    } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setCallDuration(0);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState.status]);

  // Outgoing Timer Logic
  useEffect(() => {
    if (callState.status === 'OUTGOING') {
        setOutgoingTimer(30);
        outgoingTimerRef.current = setInterval(() => {
            setOutgoingTimer(prev => {
                if (prev <= 1) {
                    clearInterval(outgoingTimerRef.current as NodeJS.Timeout);
                    endCall(); // Auto-end call
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    } else {
        if (outgoingTimerRef.current) clearInterval(outgoingTimerRef.current);
        setOutgoingTimer(30); // Reset
    }
    return () => {
        if (outgoingTimerRef.current) clearInterval(outgoingTimerRef.current);
    };
  }, [callState.status]);

  useEffect(() => {
    if (!socket) return;

    socket.on('call:incoming', (data: any) => {
      console.log("Incoming call:", data);
      setCallState({
        status: 'INCOMING',
        type: data.isGroup ? 'GROUP' : 'PRIVATE',
        callId: data.callId,
        conversationId: data.conversationId,
        caller: { 
            id: data.callerId,
            name: data.callerName,
            profileImage: data.callerProfileImage
        },
        remoteUserId: data.callerId,
        remoteUserName: data.callerName,
        remoteUserProfile: data.callerProfileImage,
        isGroup: data.isGroup,
      });
    });

    socket.on('call:accepted', async (data: any) => {
      console.log("Call accepted:", data);
      if (callState.status === 'ENDING') return;
      
      setCallState(prev => ({ ...prev, status: 'ACTIVE' }));
    });

    socket.on('call:rejected', (data: any) => {
      console.log("Call rejected:", data);
      endCallCleanup();
    });

    socket.on('call:ended', (data: any) => {
      console.log("Call ended:", data);
      endCallCleanup();
    });

    socket.on('call:signal', (data: any) => {
        if (data.signal.type === 'offer') {
            console.log("[VideoCallContext] Received offer, storing it.");
            setIncomingOffer(data);
        } else if (data.signal.type === 'camera-toggle') {
            console.log("[VideoCallContext] Remote camera toggled:", data.signal.enabled);
            setIsRemoteCameraOn(data.signal.enabled);
        } else if (data.signal.type === 'mic-toggle') {
            console.log("[VideoCallContext] Remote mic toggled:", data.signal.enabled);
            setIsRemoteMicOn(data.signal.enabled);
        } else {
            handleSignal(data.signal, data.from);
        }
    });

    socket.on('call:error', (data: any) => {
        console.error("Call error:", data);
        endCallCleanup();
    });

    return () => {
      socket.off('call:incoming');
      socket.off('call:accepted');
      socket.off('call:rejected');
      socket.off('call:ended');
      socket.off('call:signal');
      socket.off('call:error');
    };
  }, [socket, callState, handleSignal]);

  const getMediaStream = async (audioDeviceId?: string) => {
    console.log("[VideoCallContext] Requesting media permissions...");
    try {
      const constraints = {
          video: true,
          audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("[VideoCallContext] Error accessing media devices:", err);
      // Basic fallback
      return null;
    }
  };

  const startCall = async (conversationId: string, receiverId: string, isGroup: boolean, receiverName?: string, receiverImage?: string) => {
    console.log(`[VideoCallContext] startCall. convId=${conversationId}, receiverId=${receiverId}`);
    
    if (!socket || !currentUser) return;

    const stream = await getMediaStream();
    if (!stream) return;

    const newCallId = `${conversationId}-${Date.now()}`;
    
    try {
        setCallState({
          status: 'OUTGOING',
          type: isGroup ? 'GROUP' : 'PRIVATE',
          callId: newCallId,
          conversationId,
          caller: { 
              id: currentUser.id,
              name: currentUser.name,
              profileImage: currentUser.profileImage
          },
          remoteUserId: receiverId,
          remoteUserName: receiverName || 'Unknown',
          remoteUserProfile: receiverImage || null,
          isGroup,
        });

        if (isGroup) {
            joinRoom(conversationId, currentUser.id, stream);
        } else {
            const pc = createPeerConnection(receiverId);
            addLocalStream(stream);
            
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            socket.emit('call:initiate', {
                receiverId,
                callId: newCallId, // Send the generated callId to the receiver
                callerId: currentUser.id, 
                conversationId,
                isGroup,
                callerName: currentUser.name,
                callerProfileImage: currentUser.profileImage
            });
            
            socket.emit('call:signal', {
                to: receiverId,
                signal: offer
            });
        }
    } catch (error) {
        console.error("[VideoCallContext] Error in startCall:", error);
    }
  };

  const acceptCall = async () => {
    const stream = await getMediaStream();
    if (!stream) return;

    setCallState(prev => ({ ...prev, status: 'ACTIVE' }));

    if (callState.isGroup && callState.conversationId) {
        joinRoom(callState.conversationId, currentUser.id, stream);
    } else {
        if (callState.remoteUserId) {
            createPeerConnection(callState.remoteUserId);
            addLocalStream(stream);

            if (incomingOffer) {
                await handleSignal(incomingOffer.signal, incomingOffer.from);
                setIncomingOffer(null);
            }
        }
    }

    socket?.emit('call:accept', {
        callerId: callState.caller?.id,
        callId: callState.callId,
        conversationId: callState.conversationId
    });
  };

  const rejectCall = () => {
    socket?.emit('call:reject', {
        callerId: callState.caller?.id,
        callId: callState.callId,
        conversationId: callState.conversationId
    });
    endCallCleanup();
  };

  const endCall = () => {
    const targetId = callState.remoteUserId || callState.caller?.id;
    console.log("[VideoCallContext] Ending call. Target:", targetId, "Role:", callState.status);
    
    socket?.emit('call:end', {
        conversationId: callState.conversationId,
        callId: callState.callId,
        to: targetId,
        duration: callDuration
    });
    endCallCleanup();
  };

  const endCallCleanup = () => {
    setCallState({
        status: 'IDLE',
        type: 'PRIVATE',
        callId: null,
        conversationId: null,
        caller: null,
        remoteUserId: null,
        remoteUserName: null,
        remoteUserProfile: null,
        isGroup: false,
    });
    
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
    }
    
    closeConnection();
    leaveRoom();
    setIsRemoteCameraOn(true);
    setIsRemoteMicOn(true);
  };

  const toggleMic = () => {
      if (localStream) {
          const newStatus = !isMicOn;
          localStream.getAudioTracks().forEach(track => track.enabled = newStatus);
          setIsMicOn(newStatus);
          
          if (callState.remoteUserId) {
             socket?.emit('call:signal', {
                 to: callState.remoteUserId,
                 signal: { type: 'mic-toggle', enabled: newStatus }
             });
          }
      }
  };

  const toggleCamera = () => {
      if (localStream) {
          const newStatus = !isCameraOn;
          localStream.getVideoTracks().forEach(track => track.enabled = newStatus);
          setIsCameraOn(newStatus);

          if (callState.remoteUserId) {
             socket?.emit('call:signal', {
                 to: callState.remoteUserId,
                 signal: { type: 'camera-toggle', enabled: newStatus }
             });
          }
      }
  };

  const switchAudioInput = async (deviceId: string) => {
    const newStream = await getMediaStream(deviceId);
    if (newStream) {
        const audioTrack = newStream.getAudioTracks()[0];
        if (localStream) {
            localStream.removeTrack(localStream.getAudioTracks()[0]);
            localStream.addTrack(audioTrack);
            audioTrack.enabled = isMicOn;
            
            replaceTrack(audioTrack);
        }
    }
  };

  return (
    <VideoCallContext.Provider value={{
      callState,
      localStream,
      remoteStream,
      sfuParticipants,
      audioInputs,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      toggleMic,
      toggleCamera,
      switchAudioInput,
      isMicOn,
      isCameraOn,
      isRemoteMicOn,
      isRemoteCameraOn,
      callDuration,
      outgoingTimer
    }}>
      {children}
    </VideoCallContext.Provider>
  );
};
