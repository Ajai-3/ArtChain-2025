import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ChatArea from "../components/chat/ChatArea";
import ChatUserList from "../components/chat/ChatUserList";
import { useRecentConversations } from "../hooks/chat/useRecentConversations";
import {
  setConversations,
  addConversations,
  cacheUsers,
} from "../../../redux/slices/chatSlice";
import {
  selectConversations,
  selectCurrentUserId,
} from "../../../redux/selectors/chatSelectors";
import { useSendMessage } from "../hooks/chat/socket/useSendMessage";
import { useConvoOpen } from "../hooks/chat/socket/useConvoOpen";
import { useDeleteMessage } from "../hooks/chat/socket/useDeleteMessage";
import { useSocketMessages } from "../hooks/chat/socket/useSocketMessages";
import { ROUTES } from "../../../constants/routes";

const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sendMessage } = useSendMessage();
  const { conversationId } = useParams<{ conversationId: string }>();
  const currentUserId = useSelector(selectCurrentUserId);
  const { deleteMessage } = useDeleteMessage(currentUserId || "");

  useConvoOpen(conversationId);
  useSocketMessages();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRecentConversations();

  const conversations = useSelector(selectConversations);
  
  useEffect(() => {
    if (!data?.pages) return;
    const serverConversations = data.pages.flatMap((p) => p.conversations);

    const usersToCache: any[] = [];
    serverConversations.forEach((c) => {
      if (c.partner && c.partner.id) {
        usersToCache.push(c.partner);
      }
    });

    if (usersToCache.length > 0) {
      dispatch(cacheUsers(usersToCache));
    }

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

  // Use conversationId directly to determine view state on mobile
  const isChatOpen = !!conversationId;

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
    (params: { content: string; mediaType?: "TEXT" | "IMAGE"; tempId?: string; mediaUrl?: string }) => {
      if (!conversationId) return;
      sendMessage({ conversationId, ...params });
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
    if (!conversationId) return;
    deleteMessage(id, conversationId, forAll);
  }, [conversationId, deleteMessage]);

  if (!currentUserId) return <div>Loading user…</div>;

  return (
    <div className="flex h-full bg-background overflow-hidden">
      <div
        className={`${
          isChatOpen ? "hidden" : "flex"
        } md:flex w-full md:w-80 flex-shrink-0`}
      >
        <ChatUserList
          selectedConversation={conversationId || null}
          onSelectConversation={handleSelectConversation}
          onScrollToLoadMore={() =>
            hasNextPage && !isFetchingNextPage && fetchNextPage()
          }
          isFetchingNextPage={isFetchingNextPage}
          isLoading={!data && !isFetchingNextPage}
        />
      </div>

      <div
        className={`${
          isChatOpen ? "flex" : "hidden"
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
