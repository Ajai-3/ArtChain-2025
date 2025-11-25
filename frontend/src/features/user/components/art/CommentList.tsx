import React from "react";
import { useGetComments } from "../../hooks/art/useGetComments";
import type { Comment } from "../../hooks/art/useGetComments";
import { User, MoreVertical } from "lucide-react";
import { ContentOptionsModal } from "../report/ContentOptionsModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../../../../libs/formatTimeAgo";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

interface Props {
  postId: string;
}

const CommentList: React.FC<Props> = ({ postId }) => {
  const navigate = useNavigate();
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetComments(postId);

  if (isLoading) return <p className="text-gray-400">Loading comments...</p>;
  if (!data?.pages?.[0]?.comments.length)
    return <p className="text-gray-400">No comments yet.</p>;

  const handleUserClick = (username: string) => {
    navigate(`/${username}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {data.pages.map((page, pageIndex) =>
        page.comments.map((c: Comment) => (
          <div
            key={c._id ?? `${pageIndex}-${c.userName}`}
            className="flex gap-3 p-3"
          >
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
              </div>
              {/* <span className="text-gray-400 text-sm mt-0.5 mb-1">@{c.userName}</span> */}
              <p className="text-gray-300 mt-1">{c.content}</p>
            </div>
            
            <button 
              onClick={() => setReportingCommentId(c._id)}
              className="p-1 hover:bg-zinc-800 rounded-full h-fit"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>
          </div>
        ))
      )}

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
            // Logic to open edit mode for this comment
            console.log("Edit comment", reportingCommentId);
          }}
        />
      )}
    </div>
  );
};

export default CommentList;
