import React from 'react';
import { useVideoCall } from '../../../../context/VideoCallContext';
import { Phone, PhoneOff } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';

export const IncomingCallModal: React.FC = () => {
  const { callState, acceptCall, rejectCall } = useVideoCall();

  if (callState.status !== 'INCOMING') return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-top-4 duration-300">
      <Card className="w-80 shadow-2xl border-main-color/20 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-main-color/20">
              <AvatarImage src={callState.caller?.profileImage} alt={callState.caller?.name} />
              <AvatarFallback className="bg-main-color/10 text-main-color font-bold">
                {callState.caller?.name?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-main-color opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-main-color"></span>
            </span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <h3 className="font-semibold text-lg leading-none tracking-tight truncate">
              {callState.isGroup ? 'Group Call' : 'Incoming Call'}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {callState.caller?.name || 'Unknown Caller'}
            </p>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
           <p className="text-xs text-center text-muted-foreground animate-pulse">
             Incoming video call...
           </p>
        </CardContent>
        <CardFooter className="flex justify-between gap-3 pt-2">
          <Button 
            variant="destructive" 
            className="flex-1 gap-2" 
            onClick={rejectCall}
          >
            <PhoneOff className="h-4 w-4" />
            Decline
          </Button>
          <Button 
          variant={"main"}
            className="flex-1" 
            onClick={acceptCall}
          >
            <Phone className="h-4 w-4" />
            Accept
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
