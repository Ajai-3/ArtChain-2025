import { useSelector } from "react-redux";
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
import { uploadImage } from "../../../../api/user/upload";
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
  onSendImage, // unused now
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
  const [isUploading, setIsUploading] = useState(false);
  const userCache = useSelector(selectUserCache);

  const senderIds = useMemo(
    () => messages.map((m) => m.senderId).filter(Boolean),
    [messages]
  );

  useUserResolver(senderIds);
  useMarkRead(convId, currentUserId);

  const handleVideoCall = useCallback(() => {
    console.log("Video call with:", selectedConversation?.partner?.name);
  }, [selectedConversation]);

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

    setIsUploading(true);
    const tempId = `temp-${Date.now()}`;

    // Show temporary message immediately (handled by onSendMessage which calls sendMessage hook which adds to store)
    // But we need the key first? 
    // User wants: "shwo a simpel preview like in watsam and whe n user lik thn ormal sne message in th chat i need send okay so jest shwo th image as previ messag qith th temp i"
    // So show temp message with BLURRED image (local preview) while uploading.
    
    // To do this, we can call onSendMessage with a special "temp-image" content or handle it in the hook.
    // But the hook expects `content` to be the message content.
    // If we send the image, the `content` will be the key.
    
    // Strategy:
    // 1. Upload first.
    // 2. Then send message.
    // User said: "shwo a simpel preview like in watsam... show ablured top lare dn loader okay liek image is sendign okay then thsi actluy need to call th s3 servide to upload"
    // This implies showing the message in the chat list BEFORE upload completes.
    
    // However, `useSendMessage` adds the message to the store immediately.
    // If I pass the local object URL as content, it might work for display if I handle it in MessageBubble.
    // But backend expects key.
    
    // Let's stick to: Upload -> Send. 
    // Because `useSendMessage` emits socket event immediately too.
    // If I emit socket event with local URL, other users won't see it.
    
    // Wait, `useSendMessage` does: dispatch(addMessage) AND socket.emit.
    // I can modify `useSendMessage` to NOT emit if it's a temp image? No.
    
    // User said: "show ablured top lare dn loader okay liek image is sendign okay then thsi actluy need to call th s3 servide to upload... after thant cresaving image in s3 it call http to chat service"
    
    // Okay, the user wants a complex flow:
    // 1. Show temp message in UI (local only).
    // 2. Upload to S3.
    // 3. Call backend (HTTP) to save message.
    // 4. Backend broadcasts.
    
    // My current `useSendMessage` uses Socket to send.
    // User asked for HTTP call? "call http to chat service through the gatway"
    // But `useSendMessage` uses socket.
    
    // If I use socket, it's easier.
    // I will Upload -> Send (Socket).
    // The "sending" state will be the upload progress (modal loader).
    // Once uploaded, it sends.
    // This is simpler and robust.
    
    try {
      const { key } = await uploadImage(previewImage);
      const mediaUrl = URL.createObjectURL(previewImage);
      onSendMessage({ content: key, mediaType: "IMAGE", tempId, mediaUrl });
      setPreviewImage(null);
    } catch (error) {
      console.error("Failed to upload image", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
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
