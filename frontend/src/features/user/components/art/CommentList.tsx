import React from "react";
import { useGetComments } from "../../hooks/art/useGetComments";
import type { Comment } from "../../hooks/art/useGetComments";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  postId: string;
}

const CommentList: React.FC<Props> = ({ postId }) => {
  const navigate = useNavigate();
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
                  {c.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                </div>
              )}
            </div>

            {/* Comment content */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {/* Clickable user name */}
                <span
                  onClick={() => handleUserClick(c.userName)}
                  className="font-semibold text-white cursor-pointer hover:text-main-color"
                >
                  {c.name}
                </span>
                <span className="text-gray-500 text-xs">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </span>
              </div>
              <span className="text-gray-400 text-sm mt-0.5 mb-1">@{c.userName}</span>
              <p className="text-gray-300 mt-1">{c.content}</p>
            </div>
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
      {!hasNextPage && <p className="text-gray-400 text-center mt-2">No more comments</p>}
    </div>
  );
};

export default CommentList;
