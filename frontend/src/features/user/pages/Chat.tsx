import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ChatArea from "../components/chat/ChatArea";
import ChatUserList from "../components/chat/ChatUserList";
import { useRecentConversations } from "../hooks/chat/useRecentConversations";
import {
  setConversations,
  addConversations,
} from "../../../redux/slices/chatSlice";
import {
  selectConversations,
  selectCurrentUserId,
  selectMessagesByConversationId,
} from "../../../redux/selectors/chatSelectors";
import { useSendMessage } from "../hooks/chat/socket/useSendMessage";
import { useConvoOpen } from "../hooks/chat/socket/useConvoOpen";
import { ROUTES } from "../../../constants/routes";

const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sendMessage } = useSendMessage();
  const { conversationId } = useParams<{ conversationId: string }>();

  // Safe socket subscription
  useConvoOpen(conversationId);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRecentConversations();

  const conversations = useSelector(selectConversations);
  const currentUserId = useSelector(selectCurrentUserId);

  // Select messages for current conversation
  const messages = useSelector((state: any) =>
    selectMessagesByConversationId(state, conversationId || "")
  );

  // Merge server conversations safely
  useEffect(() => {
    if (!data?.pages) return;
    const serverConversations = data.pages.flatMap((p) => p.conversations);

    if (conversations.length === 0) {
      dispatch(setConversations(serverConversations));
    } else {
      const newConvs = serverConversations.filter(
        (c) => !conversations.some((ex) => ex.id === c.id)
      );
      if (newConvs.length > 0) {
        dispatch(addConversations(newConvs));
      }
    }
  }, [data?.pages, conversations.length, dispatch]); 

  const [mobileView] = useState<"list" | "chat">(
    conversationId ? "chat" : "list"
  );

  const selectedConversation = useMemo(
    () =>
      conversationId
        ? conversations.find((c) => c.id === conversationId) || null
        : null,
    [conversationId, conversations]
  );

  const handleSelectConversation = useCallback(
    (id: string) => {
      navigate(ROUTES.CHAT_CONVERSATION(id));
    },
    [navigate]
  );

  const handleBackToList = useCallback(() => {
    navigate(ROUTES.CHAT);
  }, [navigate]);

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!conversationId) return;
      sendMessage({ conversationId, content: text });
    },
    [conversationId, sendMessage]
  );

  const handleSendImage = useCallback(
    (mediaUrl?: string) => {
      if (!conversationId) return;
      console.log("TODO: send image", mediaUrl);
    },
    [conversationId]
  );

  const handleDeleteMessage = useCallback((id: string, forAll: boolean) => {
    console.log("TODO: delete message", id, forAll);
  }, []);

  if (!currentUserId) return <div>Loading user…</div>;

  return (
    <div className="flex h-full bg-background overflow-hidden">
      <div
        className={`${
          mobileView === "list" || !conversationId ? "flex" : "hidden"
        } md:flex w-full md:w-80 flex-shrink-0`}
      >
        <ChatUserList
          selectedConversation={conversationId || null}
          onSelectConversation={handleSelectConversation}
          onScrollToLoadMore={() =>
            hasNextPage && !isFetchingNextPage && fetchNextPage()
          }
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>

      <div
        className={`${
          mobileView === "chat" && conversationId ? "flex" : "hidden"
        } md:flex flex-1 w-full`}
      >
        <ChatArea
          selectedConversation={selectedConversation}
          onBack={handleBackToList}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
          onDeleteMessage={handleDeleteMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
