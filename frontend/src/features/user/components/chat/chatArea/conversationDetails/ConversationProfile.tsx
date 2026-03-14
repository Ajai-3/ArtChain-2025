import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserCache, selectCurrentUserId } from "../../../../../../redux/selectors/chatSelectors";
import { ConversationType } from "../../../../../../types/chat/chat";
import type { Conversation } from "../../../../../../types/chat/chat";

interface ConversationProfileProps {
  conversation: Conversation;
  onClose: () => void;
}

const ConversationProfile: React.FC<ConversationProfileProps> = ({ conversation, onClose }) => {
  const navigate = useNavigate();
  const currentUserId = useSelector(selectCurrentUserId);
  const userCache = useSelector(selectUserCache);

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
    if (conversation.partner?.username) {
      navigate(`/${conversation.partner.username}`);
      onClose();
    }
  };

  const profileImage = getProfileImage();

  return (
    <div className="text-center">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4 overflow-hidden">
        {profileImage ? (
          <img
            src={profileImage}
            alt={getConversationName()}
            className="w-full h-full object-cover"
          />
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
        conversation.partner && (
          <button
            onClick={handleViewProfile}
            className="mt-2 md:mt-3 text-xs md:text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View Profile
          </button>
        )}
    </div>
  );
};

export default ConversationProfile;
