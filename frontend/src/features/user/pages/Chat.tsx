// pages/Chat.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ChatArea from "../components/chat/ChatArea";
import ChatUserList from "../components/chat/ChatUserList";
import { useRecentConversations } from "../hooks/chat/useRecentConversations";
import {
  setConversations,
  addConversations,
} from "../../../redux/slices/chatSlice";
import type { RootState } from "../../../redux/store";

import { useSendMessage } from "../hooks/chat/socket/useSendMessage";
import { useConvoOpen } from "../hooks/chat/socket/useConvoOpen";

const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sendMessage } = useSendMessage();
  const { conversationId } = useParams<{ conversationId: string }>();
  useConvoOpen(conversationId);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRecentConversations();

  const conversations = useSelector((s: RootState) => s.chat.conversations);

  useEffect(() => {
    if (!data?.pages) return;
    const server = data.pages.flatMap((p) => p.conversations);
    if (!conversations.length) dispatch(setConversations(server));
    else {
      const next = server.filter(
        (c) => !conversations.some((ex) => ex.id === c.id)
      );
      if (next.length) dispatch(addConversations(next));
    }
  }, [data, conversations, dispatch]);

  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const currentUserId = useSelector((s: RootState) => s.user.user?.id);
  const chatMessages = useSelector((s: RootState) => s.chat.messages);
  const selectedConversation = useMemo(
    () =>
      conversationId
        ? conversations.find((c) => c.id === conversationId) || null
        : null,
    [conversationId, conversations]
  );
  const messages = useMemo(
    () => (conversationId ? chatMessages[conversationId] || [] : []),
    [conversationId, chatMessages]
  );

  useEffect(() => {
    setMobileView(conversationId ? "chat" : "list");
  }, [conversationId]);

  const handleSelectConversation = (id: string) => {
    navigate(`/chat/${id}`);
    setMobileView("chat");
  };
  const handleBackToList = () => {
    navigate("/chat");
    setMobileView("list");
  };


  const handleSendMessage = (text: string) => {
    if (!conversationId) return;
    let obj = {
      conversationId,
      content: text
    }
    sendMessage(obj);
  };

  const handleSendImage = (mediaUrl?: string) => {
    if (!conversationId) return;
    console.log("TODO: send image", mediaUrl);
  };

  const handleDeleteMessage = (id: string, forAll: boolean) => {
    console.log("TODO: delete message", id, forAll);
  };

  if (!currentUserId) return <div>Loading user…</div>;

  return (
    <div className="flex h-full bg-background overflow-hidden">
      <div
        className={`${
          mobileView === "list" ? "flex" : "hidden"
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
          mobileView === "chat" ? "flex" : "hidden"
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
