import { useSelector } from "react-redux";
import { useVideoCall } from "../../../../context/VideoCallContext";
import ChatInput from "./chatArea/Chatinput";
import ChatHeader from "./chatArea/ChatHeader";
import React, { useState, useMemo, useCallback, useRef } from "react";
import ChatMessages from "./chatArea/ChatMessage";
import { selectUserCache } from "../../../../redux/selectors/chatSelectors";
import { type Conversation } from "../../../../types/chat/chat";
import ConversationDetails from "./chatArea/ConversationDetails";
import { useUserResolver } from "../../hooks/chat/useUserResolver";
import { useInitialMessages } from "../../hooks/chat/useInitialMessages";
import { getChatSocket } from "../../../../socket/socketManager";
import { useMarkRead } from "../../hooks/chat/useMarkRead";
import { useChatUpload } from "../../hooks/chat/useChatUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";

interface ChatAreaProps {
  selectedConversation: Conversation | null;
  onBack?: () => void;
  currentUserId: string;
  onSendMessage: (params: { content: string; mediaType?: "TEXT" | "IMAGE"; tempId?: string; mediaUrl?: string }) => void;
  onSendImage: (mediaUrl?: string) => void;
  onDeleteMessage: (messageId: string, deleteForAll: boolean) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedConversation,
  onBack,
  currentUserId,
  onSendMessage,
  onSendImage,
  onDeleteMessage,
}) => {
  const convId = selectedConversation?.id ?? "";
  const lastTypingRef = useRef<number>(0);

  const {
    messages,
    loadMoreMessages,
    hasMore,
    isLoading,
    isFetchingMore,
  } = useInitialMessages(convId);

  const [showDetails, setShowDetails] = useState(false);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const { uploadImage, uploading: isUploading } = useChatUpload();
  const userCache = useSelector(selectUserCache);

  const senderIds = useMemo(
    () => messages.map((m) => m.senderId).filter(Boolean),
    [messages]
  );

  useUserResolver(senderIds);
  useMarkRead(convId, currentUserId);

  const { startCall } = useVideoCall();

  const handleVideoCall = useCallback(() => {
    if (selectedConversation && selectedConversation.partner) {
        startCall(
          selectedConversation.id, 
          selectedConversation.partner.id, 
          false,
          selectedConversation.partner.name,
          selectedConversation.partner.profileImage || undefined
        );
    }
  }, [selectedConversation, startCall]);

  const handleVoiceCall = useCallback(() => {
    console.log("Voice call with:", selectedConversation?.partner?.name);
  }, [selectedConversation]);

  const handleToggleDetails = useCallback(() => {
    setShowDetails((prev) => !prev);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setShowDetails(false);
  }, []);

  const handleTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastTypingRef.current > 2000) {
      const socket = getChatSocket();
      if (socket && socket.connected && selectedConversation) {
        socket.emit("typing", { conversationId: selectedConversation.id });
        lastTypingRef.current = now;
      }
    }
  }, [selectedConversation]);

  const handleFileSelect = useCallback((file: File) => {
    setPreviewImage(file);
  }, []);

  const handleConfirmSend = async () => {
    if (!previewImage) return;

    const tempId = `temp-${Date.now()}`;
    
    const result = await uploadImage(previewImage);
    
    if (result) {
        const { key } = result;
        const mediaUrl = URL.createObjectURL(previewImage);
        onSendMessage({ content: key, mediaType: "IMAGE", tempId, mediaUrl });
        setPreviewImage(null);
    }
  };

  if (!selectedConversation) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Your Messages</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Select a conversation to start messaging
          </p>
          <button
            onClick={onBack}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Back to conversations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-full relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://pic.rutubelist.ru/video/84/49/84491f90cc1b8fea562ad525afaaf08f.jpg')",
      }}
    >
      <div className="dark:bg-[url('https://i.pinimg.com/originals/47/fb/b6/47fbb68a37492662cd74715d7787a212.jpg')] dark:bg-cover dark:bg-center dark:bg-no-repeat absolute inset-0"></div>
      <div
        className={`flex flex-col h-full transition-all duration-300 z-50 ${
          showDetails ? "w-0 md:w-[calc(100%-384px)]" : "w-full"
        }`}
      >
        <ChatHeader
          currentUserId={currentUserId}
          conversation={selectedConversation}
          onBack={onBack}
          onToggleDetails={handleToggleDetails}
          showDetails={showDetails}
          onVideoCall={handleVideoCall}
          onVoiceCall={handleVoiceCall}
        />

        <ChatMessages
          messages={messages}
          conversation={selectedConversation}
          currentUserId={currentUserId}
          onDeleteMessage={onDeleteMessage}
          loadMoreMessages={loadMoreMessages}
          hasMore={hasMore}
          isLoading={isLoading}
          isFetchingMore={isFetchingMore}
          userMap={userCache}
        />

        <ChatInput
          onSendMessage={(text) => onSendMessage({ content: text, mediaType: "TEXT" })}
          onSendImage={handleFileSelect}
          onTyping={handleTyping}
          disabled={selectedConversation.locked}
        />
      </div>

      {showDetails && (
        <ConversationDetails
          conversation={selectedConversation}
          onClose={handleCloseDetails}
          currentUserId={currentUserId}
        />
      )}

      <Dialog open={!!previewImage} onOpenChange={(open) => !open && !isUploading && setPreviewImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {previewImage && (
              <img
                src={URL.createObjectURL(previewImage)}
                alt="Preview"
                className="max-h-[300px] rounded-lg object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewImage(null)} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSend} disabled={isUploading}>
              {isUploading ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatArea;
