import React, { useEffect, useRef } from 'react';
import { useVideoCall } from '../../../../context/VideoCallContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../redux/store';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const CallOverlay: React.FC = () => {
  const { 
    callState, 
    localStream, 
    remoteStream, 
    endCall, 
    toggleMic, 
    toggleCamera, 
    isMicOn, 
    isCameraOn,
    isRemoteCameraOn,
    callDuration,
    outgoingTimer
  } = useVideoCall();

  const currentUser = useSelector((state: RootState) => state.user.user);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isCameraOn]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, isRemoteCameraOn]); 

  if (callState.status !== 'ACTIVE' && callState.status !== 'OUTGOING') return null;

  const remoteName = callState.remoteUserName || 'Unknown User';
  const remoteImage = callState.remoteUserProfile;
  const isOutgoing = callState.status === 'OUTGOING';

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
      
      <div className="relative w-full max-w-7xl h-[90vh] mx-4 flex items-center justify-center bg-black overflow-hidden rounded-2xl">
        
        {remoteImage && !(remoteStream && isRemoteCameraOn) && (
          <div 
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-125"
            style={{ backgroundImage: `url(${remoteImage})` }}
          />
        )}
        
        <div className="absolute inset-0 bg-black/50" />
        
        {remoteStream && isRemoteCameraOn && !isOutgoing ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-black relative z-10"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 relative z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
              <Avatar className="h-44 w-44 sm:h-60 sm:w-60 border-4 border-white/20 shadow-2xl z-10 ring-4 ring-white/10">
                <AvatarImage src={remoteImage || undefined} className="object-cover" />
                <AvatarFallback className="text-5xl bg-gradient-to-br from-gray-800 to-gray-900 text-white font-bold">
                  {remoteName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOutgoing && (
                <>
                  <div className="absolute inset-[-20px] border-4 border-blue-500/50 rounded-full animate-ping" />
                  <div className="absolute inset-[-40px] border-4 border-blue-500/30 rounded-full animate-ping" />
                </>
              )}
            </div>
            <div className="text-center space-y-3 z-10 px-8 py-4 rounded-2xl bg-black/40 border border-white/20">
              <h3 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                {remoteName}
              </h3>
              <div className="flex items-center justify-center gap-3">
                <div className={`h-3 w-3 rounded-full ${isOutgoing ? 'bg-blue-400' : 'bg-green-400'}`} />
                <p className="text-gray-200 font-medium text-lg">
                  {isOutgoing 
                    ? `Ringing... (${outgoingTimer}s)` 
                    : (remoteStream ? "Camera is off" : "Connecting...")}
                </p>
              </div>
            </div>
          </div>
        )}

        {!isOutgoing && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/70 px-6 py-3 rounded-full border border-white/20 shadow-2xl z-30">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 bg-green-500 rounded-full" />
              <span className="text-white font-mono text-lg tracking-wider font-bold">
                {formatTime(callDuration)}
              </span>
            </div>
          </div>
        )}

        <div className="absolute top-6 right-6 w-36 sm:w-56 aspect-video bg-black/80 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 z-30">
          {isCameraOn ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-white/20">
                <AvatarImage src={currentUser?.profileImage} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-white font-bold text-2xl">
                  {currentUser?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-medium">
            You
          </div>
        </div>
       
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 px-6 py-4 rounded-2xl border border-white/20 shadow-2xl z-40">
          
          <Button
            size="icon"
            className={`relative h-14 w-14 rounded-full transition-all duration-200 ${
              isMicOn 
                ? 'bg-white/20 hover:bg-white/30 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            onClick={toggleMic}
          >
            {isMicOn ? (
              <Mic className="h-6 w-6" />
            ) : (
              <>
                <MicOff className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
              </>
            )}
          </Button>

          <Button
            size="icon"
            className={`relative h-14 w-14 rounded-full transition-all duration-200 ${
              isCameraOn 
                ? 'bg-white/20 hover:bg-white/30 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            onClick={toggleCamera}
          >
            {isCameraOn ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>

          <div className="w-px h-10 bg-white/20 mx-2" />

          <Button
            variant="destructive"
            size="icon"
            className="relative h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 transition-transform duration-200 hover:scale-105 active:scale-95"
            onClick={endCall}
          >
            <PhoneOff className="h-7 w-7" />
          </Button>

        </div>
      </div>
    </div>
  );
};