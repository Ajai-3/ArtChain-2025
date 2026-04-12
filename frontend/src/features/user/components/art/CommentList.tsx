import React, { useState } from "react";
import { useGetComments } from "../../hooks/art/useGetComments";
import type { Comment } from "../../hooks/art/useGetComments";
import { User, MoreVertical, X, Check } from "lucide-react";
import CommentInputSection from "./CommentInputSection";
import { ContentOptionsModal } from "../report/ContentOptionsModal";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../../../../libs/formatTimeAgo";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { useEditCommentMutation } from "../../hooks/art/useEditCommentMutation";
import { useDeleteCommentMutation } from "../../hooks/art/useDeleteCommentMutation";
import ConfirmModal from "../../../../components/modals/ConfirmModal";

interface Props {
  postId: string;
  artName: string;
}

const CommentList: React.FC<Props> = ({ postId, artName }) => {
  const navigate = useNavigate();
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetComments(postId);

  const editMutation = useEditCommentMutation(postId);
  const deleteMutation = useDeleteCommentMutation(postId);

  if (isLoading) return <p className="text-gray-400">Loading comments...</p>;
  if (!data?.pages?.[0]?.comments.length)
    return <p className="text-gray-400">No comments yet.</p>;

  const handleUserClick = (username: string) => {
    navigate(`/${username}`);
  };

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
    setReportingCommentId(null);
  };

  const handleSaveEdit = () => {
    if (editingCommentId && editContent.trim()) {
      editMutation.mutate(
        { commentId: editingCommentId, content: editContent },
        {
          onSuccess: () => {
            setEditingCommentId(null);
            setEditContent("");
          },
        }
      );
    }
  };

  const handleDeleteClick = () => {
    if (reportingCommentId) {
      setDeletingCommentId(reportingCommentId);
      setReportingCommentId(null);
    }
  };

  const confirmDelete = () => {
    if (deletingCommentId) {
      deleteMutation.mutate(deletingCommentId, {
        onSuccess: () => {
          setDeletingCommentId(null);
        },
      });
    }
  };

  const allComments = data?.pages.flatMap(p => p.comments) || [];
  const parentComments = allComments.filter(c => !c.replyToId);
  const repliesByParentId = allComments.reduce((acc, c) => {
    if (c.replyToId) {
      if (!acc[c.replyToId]) acc[c.replyToId] = [];
      acc[c.replyToId].push(c);
    }
    return acc;
  }, {} as Record<string, Comment[]>);

  const renderComment = (c: Comment, isReply = false): React.ReactNode => {
    return (
      <div key={c._id} className={`flex flex-col ${isReply ? 'ml-10 mt-2' : ''}`}>
        <div className="flex gap-3 p-3">
            {/* Profile image or fallback */}
            <div className="w-10">
              {c.profileImage ? (
                <img
                  src={c.profileImage}
                  alt={c.userName}
                  className="w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-600"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-600 dark:bg-zinc-800 flex items-center justify-center text-white font-semibold">
                  {c.name?.charAt(0).toUpperCase() || (
                    <User className="w-4 h-4" />
                  )}
                </div>
              )}
            </div>

            {/* Comment content */}
            <div className="flex flex-col bg-zinc-900 w-full p-2 border border-zinc-800 rounded-lg">
              <div className="flex items-center gap-2">
                {/* Clickable user name */}
                <span
                  onClick={() => handleUserClick(c.userName)}
                  className="font-semibold text-white cursor-pointer hover:text-main-color"
                >
                  {c.name}
                </span>
                <span className="text-gray-500 text-xs">
                  {formatTimeAgo(c.createdAt)}
                </span>
                {c.createdAt !== c.updatedAt && (
                <span className="text-gray-500 text-xs italic">(edited)</span>
              )}
            </div>
            
            {editingCommentId === c._id ? (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 bg-zinc-800 text-white rounded px-2 py-1 outline-none border border-zinc-700 focus:border-main-color"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  disabled={editMutation.isPending}
                  className="p-1 bg-green-600 rounded hover:bg-green-700 text-white"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="p-1 bg-red-600 rounded hover:bg-red-700 text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <p className="text-gray-300 mt-1">{c.content}</p>
            )}
            
            {!editingCommentId && !isReply && (
              <div className="mt-2">
                <button 
                  onClick={() => setReplyingToId(replyingToId === c._id ? null : c._id)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setReportingCommentId(c._id)}
            className="p-1 hover:bg-zinc-800 rounded-full h-fit"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>
      
      {!isReply && repliesByParentId[c._id] && (
        <div className="flex flex-col">
          {repliesByParentId[c._id].map(reply => renderComment(reply, true))}
        </div>
      )}

      {replyingToId === c._id && !isReply && (
        <div className="ml-10 mt-2">
          {/* We import CommentInputSection dynamically or assume it's available, let's just use it safely */}
          <CommentInputSection 
             postId={postId} 
             artname={artName} 
             replyToId={c._id} 
             onSuccessAction={() => setReplyingToId(null)} 
             onCancel={() => setReplyingToId(null)} 
          />
        </div>
      )}
    </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {parentComments.map((c: Comment) => renderComment(c))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="mt-2 px-6 py-3 text-white rounded-lg transition-all"
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
      {!hasNextPage && (
        <p className="text-gray-400 text-center mt-2">No more comments</p>
      )}

      {reportingCommentId && (
        <ContentOptionsModal
          isOpen={!!reportingCommentId}
          onClose={() => setReportingCommentId(null)}
          targetId={reportingCommentId}
          targetType="comment"
          canEdit={data?.pages.flatMap(p => p.comments).find(c => c._id === reportingCommentId)?.userId === user.user?.id}
          onEdit={() => {
            const comment = data?.pages.flatMap(p => p.comments).find(c => c._id === reportingCommentId);
            if (comment) handleEditClick(comment);
          }}
          onDelete={handleDeleteClick}
        />
      )}

      <ConfirmModal
        isOpen={!!deletingCommentId}
        onClose={() => setDeletingCommentId(null)}
        onConfirm={confirmDelete}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default CommentList;
