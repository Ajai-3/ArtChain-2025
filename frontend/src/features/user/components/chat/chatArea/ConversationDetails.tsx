import React from "react";
import { useGroupMembers } from "../../../hooks/chat/useGroupMembers";
import { useGroupActions } from "../../../hooks/chat/useGroupActions";
import type { Conversation } from "../../../../../types/chat/chat";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../redux/store";
import ConversationHeader from "./conversationDetails/ConversationHeader";
import ConversationProfile from "./conversationDetails/ConversationProfile";
import ConversationMembers from "./conversationDetails/ConversationMembers";
import ConversationActions from "./conversationDetails/ConversationActions";

interface ConversationDetailsProps {
  conversation: Conversation;
  onClose: () => void;
  currentUserId: string;
}

const ConversationDetails: React.FC<ConversationDetailsProps> = ({
  conversation,
  onClose,
  currentUserId,
}) => {
  const user = useSelector((state: RootState) => state.user.user);

  const {
    data: membersData,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingMembers,
  } = useGroupMembers(conversation.id);

  const { removeMember, addAdmin, removeAdmin, addMember } = useGroupActions(conversation.id);

  return (
    <div className="w-full h-full bg-background/95 backdrop-blur z-50 md:z-auto md:relative md:w-96 border-l border-border flex flex-col">
      <ConversationHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8">
        <ConversationProfile conversation={conversation} onClose={onClose} />
        
        <ConversationMembers 
            conversation={conversation}
            currentUserId={currentUserId}
            user={user}
            membersData={membersData}
            isLoadingMembers={isLoadingMembers}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            onAddAdmin={(id) => addAdmin.mutate(id)}
            onRemoveAdmin={(id) => removeAdmin.mutate(id)}
            onRemoveMember={(id) => removeMember.mutate(id)}
            onAddMember={(id) => addMember.mutate(id)}
        />

        <ConversationActions conversation={conversation} />
      </div>
    </div>
  );
};

export default ConversationDetails;
