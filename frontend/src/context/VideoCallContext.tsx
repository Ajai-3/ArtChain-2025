import React, { useEffect, useState, useRef } from 'react';
import { getChatSocket, onChatSocketAvailable } from '../socket/socketManager';
import { type RTCDirectSignal, useWebRTC } from '../hooks/useWebRTC';
import { useSFU, type SFUParticipant } from '../hooks/useSFU';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import type { Socket } from 'socket.io-client';
import type {
  IncomingCallPayload,
  CallSignalPayload,
  CallAcceptedPayload,
  CallRejectedPayload,
  CallEndedPayload,
  CallErrorPayload,
} from '../types/socket';
import { VideoCallContext } from '../hooks/useVideoCall';

interface CallerInfo {
  id: string;
  name?: string;
  profileImage?: string;
}

interface CallState {
  status: 'IDLE' | 'INCOMING' | 'OUTGOING' | 'ACTIVE' | 'ENDING';
  type: 'PRIVATE' | 'GROUP';
  callId: string | null;
  conversationId: string | null;
  caller: CallerInfo | null;
  remoteUserId: string | null;
  remoteUserName: string | null;
  remoteUserProfile: string | null;
  isGroup: boolean;
}

export interface VideoCallContextType {
  callState: CallState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  sfuParticipants: SFUParticipant[];
  audioInputs: MediaDeviceInfo[];
  startCall: (
    conversationId: string,
    receiverId: string,
    isGroup: boolean,
    receiverName?: string,
    receiverImage?: string,
  ) => Promise<void>;
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

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
  const [incomingOffer, setIncomingOffer] = useState<CallSignalPayload | null>(
    null,
  );
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [outgoingTimer, setOutgoingTimer] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const outgoingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    createPeerConnection,
    addLocalStream,
    handleSignal,
    closeConnection,
    remoteStream,
    replaceTrack,
  } = useWebRTC();
  const { joinRoom, leaveRoom, participants: sfuParticipants } = useSFU();

  const [socket, setSocket] = useState<Socket | null>(null);
  const currentUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const s = getChatSocket();
    if (s) setSocket(s);

    const cleanup = onChatSocketAvailable((socketInstance: Socket | null) => {
      setSocket(socketInstance);
    });

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setAudioInputs(devices.filter((d) => d.kind === 'audioinput'));
    });

    return cleanup;
  }, []);

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

  useEffect(() => {
    if (callState.status === 'OUTGOING') {
      setOutgoingTimer(30);
      outgoingTimerRef.current = setInterval(() => {
        setOutgoingTimer((prev) => {
          if (prev <= 1) {
            clearInterval(
              outgoingTimerRef.current as ReturnType<typeof setInterval>,
            );
            endCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (outgoingTimerRef.current) clearInterval(outgoingTimerRef.current);
      setOutgoingTimer(30);
    }
    return () => {
      if (outgoingTimerRef.current) clearInterval(outgoingTimerRef.current);
    };
  }, [callState.status]);

  useEffect(() => {
    if (!socket) return;

    socket.on('call:incoming', (data: IncomingCallPayload) => {
      setCallState({
        status: 'INCOMING',
        type: data.isGroup ? 'GROUP' : 'PRIVATE',
        callId: data.callId,
        conversationId: data.conversationId,
        caller: {
          id: data.callerId,
          name: data.callerName,
          profileImage: data.callerProfileImage || undefined,
        },
        remoteUserId: data.callerId,
        remoteUserName: data.callerName,
        remoteUserProfile: data.callerProfileImage || null,
        isGroup: data.isGroup,
      });

      if (!data.isGroup && data.callerId) {
        createPeerConnection(data.callerId);
      }
    });

    socket.on('call:accepted', async (data: CallAcceptedPayload) => {
      void data;
      if (callState.status === 'ENDING') return;

      setCallState((prev) => ({ ...prev, status: 'ACTIVE' }));
    });

    socket.on('call:rejected', (data: CallRejectedPayload) => {
      void data;
      endCallCleanup();
    });

    socket.on('call:ended', (data: CallEndedPayload) => {
      void data;
      endCallCleanup();
    });

    socket.on('call:signal', (data: CallSignalPayload) => {
      const signal = data.signal;
      if (
        'enabled' in signal &&
        'type' in signal &&
        (signal.type === 'camera-toggle' || signal.type === 'mic-toggle')
      ) {
        setIsRemoteCameraOn(signal.enabled);
        setIsRemoteMicOn(signal.enabled);
      } else if ('sdp' in signal || 'candidate' in signal) {
        handleSignal(signal as RTCDirectSignal, data.from);
      } else {
        setIncomingOffer(data);
      }
    });

    socket.on('call:error', (data: CallErrorPayload) => {
      void data;
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
    if (localStream) {
      return localStream;
    }

    try {
      const constraints = {
        video: true,
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      setIsCameraOn(true);
      return stream;
    } catch (err) {
      const error = err as { name?: string };
      if (
        error.name === 'NotReadableError' ||
        error.name === 'NotFoundError' ||
        error.name === 'NotAllowedError'
      ) {
        try {
          const fallbackConstraints = {
            video: false,
            audio: audioDeviceId
              ? { deviceId: { exact: audioDeviceId } }
              : true,
          };
          const fallbackStream =
            await navigator.mediaDevices.getUserMedia(fallbackConstraints);
          setLocalStream(fallbackStream);
          setIsCameraOn(false);
          return fallbackStream;
        } catch {
          return null;
        }
      }
      return null;
    }
  };

  const startCall = async (
    conversationId: string,
    receiverId: string,
    isGroup: boolean,
    receiverName?: string,
    receiverImage?: string,
  ) => {
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
          profileImage: currentUser.profileImage,
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
          callId: newCallId,
          callerId: currentUser.id,
          conversationId,
          isGroup,
          callerName: currentUser.name,
          callerProfileImage: currentUser.profileImage,
        });

        socket.emit('call:signal', {
          to: receiverId,
          signal: offer,
        });

        socket.emit('call:signal', {
          to: receiverId,
          signal: { type: 'camera-toggle', enabled: isCameraOn },
        });
        socket.emit('call:signal', {
          to: receiverId,
          signal: { type: 'mic-toggle', enabled: isMicOn },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const acceptCall = async () => {
    const stream = await getMediaStream();
    if (!stream) return;

    setCallState((prev) => ({ ...prev, status: 'ACTIVE' }));

    if (callState.isGroup && callState.conversationId && currentUser) {
      joinRoom(callState.conversationId, currentUser.id, stream);
    } else {
      if (callState.remoteUserId) {
        addLocalStream(stream);

        if (incomingOffer) {
          await handleSignal(
            incomingOffer.signal as RTCDirectSignal,
            incomingOffer.from,
          );
          setIncomingOffer(null);
        }

        socket?.emit('call:signal', {
          to: callState.remoteUserId,
          signal: { type: 'camera-toggle', enabled: isCameraOn },
        });
        socket?.emit('call:signal', {
          to: callState.remoteUserId,
          signal: { type: 'mic-toggle', enabled: isMicOn },
        });
      }
    }

    socket?.emit('call:accept', {
      callerId: callState.caller?.id,
      callId: callState.callId,
      conversationId: callState.conversationId,
    });
  };

  const rejectCall = () => {
    socket?.emit('call:reject', {
      callerId: callState.caller?.id,
      callId: callState.callId,
      conversationId: callState.conversationId,
    });
    endCallCleanup();
  };

  const endCall = () => {
    const targetId = callState.remoteUserId || callState.caller?.id;

    socket?.emit('call:end', {
      conversationId: callState.conversationId,
      callId: callState.callId,
      to: targetId,
      duration: callDuration,
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
      localStream.getTracks().forEach((track) => track.stop());
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
      localStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = newStatus));
      setIsMicOn(newStatus);

      if (callState.remoteUserId) {
        socket?.emit('call:signal', {
          to: callState.remoteUserId,
          signal: { type: 'mic-toggle', enabled: newStatus },
        });
      }
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      const newStatus = !isCameraOn;
      localStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = newStatus));
      setIsCameraOn(newStatus);

      if (callState.remoteUserId) {
        socket?.emit('call:signal', {
          to: callState.remoteUserId,
          signal: { type: 'camera-toggle', enabled: newStatus },
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
    <VideoCallContext.Provider
      value={{
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
        outgoingTimer,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};
