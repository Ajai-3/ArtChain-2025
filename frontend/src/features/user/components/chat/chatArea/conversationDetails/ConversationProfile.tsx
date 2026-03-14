import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Eye } from "lucide-react";
import { selectUserCache, selectCurrentUserId } from "../../../../../../redux/selectors/chatSelectors";
import { ConversationType } from "../../../../../../types/chat/chat";
import type { Conversation } from "../../../../../../types/chat/chat";
import { Dialog, DialogContent } from "../../../../../../components/ui/dialog";

interface ConversationProfileProps {
  conversation: Conversation;
  onClose: () => void;
}

const ConversationProfile: React.FC<ConversationProfileProps> = ({ conversation, onClose }) => {
  const navigate = useNavigate();
  const currentUserId = useSelector(selectCurrentUserId);
  const userCache = useSelector(selectUserCache);
  const [isZoomed, setIsZoomed] = useState(false);

  const partnerId = conversation.type === "PRIVATE" || conversation.type === "REQUEST"
    ? (conversation.memberIds?.find((id) => id !== currentUserId) || conversation.partner?.id)
    : undefined;
  
  const resolvedPartner = partnerId ? (userCache[partnerId] || conversation.partner) : conversation.partner;

  const getConversationName = () => {
    if (conversation.type === "GROUP") {
      return conversation.name || conversation.group?.name || "Unnamed Group";
    }
    return resolvedPartner?.name || "Unknown User";
  };

  const getProfileImage = () => {
    if ((conversation.type === "PRIVATE" || conversation.type === "REQUEST") && resolvedPartner?.profileImage) {
      return resolvedPartner.profileImage;
    }
    if (conversation.type === "GROUP" && conversation?.group?.profileImage) {
      return conversation?.group?.profileImage;
    }
    return null;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleViewProfile = () => {
    if (resolvedPartner?.username) {
      navigate(`/${resolvedPartner.username}`);
      onClose();
    }
  };

  const profileImage = getProfileImage();

  const isPrivateOrRequest = conversation.type === "PRIVATE" || conversation.type === "REQUEST";

  return (
    <div className="text-center">
      <div 
        className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4 overflow-hidden relative ${isPrivateOrRequest ? "cursor-pointer group" : ""}`}
        onClick={() => {
          if (isPrivateOrRequest && profileImage) setIsZoomed(true);
        }}
      >
        {profileImage ? (
          <>
            <img
              src={profileImage}
              alt={getConversationName()}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            {isPrivateOrRequest && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-6 h-6 text-white" />
              </div>
            )}
          </>
        ) : (
          <span className="text-xl md:text-2xl font-semibold text-primary">
            {getInitials(getConversationName())}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-lg md:text-xl mb-1 md:mb-2">
        {getConversationName()}
      </h3>

      <p className="text-muted-foreground text-xs md:text-sm">
        {conversation.type === ConversationType.GROUP
          ? `${conversation.memberIds?.length || 0} members`
          : conversation.type === ConversationType.PRIVATE
          ? "Private conversation"
          : "Request conversation"}
      </p>

      {(conversation.type === ConversationType.PRIVATE || conversation.type === ConversationType.REQUEST) &&
        resolvedPartner && (
          <button
            onClick={handleViewProfile}
            className="mt-2 md:mt-3 text-xs md:text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View Profile
          </button>
        )}

      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-md bg-transparent border-none shadow-none flex items-center justify-center p-0">
          {profileImage && (
             <img 
               src={profileImage} 
               alt="Zoomed Profile" 
               className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
             />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConversationProfile;
