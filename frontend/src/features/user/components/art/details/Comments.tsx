import React from "react";
import CommentInputSection from "../CommentInputSection";
import CommentList from "../CommentList";

interface CommentsProps {
  artId: string;
  artName: string;
  commentingDisabled: boolean;
}

const Comments: React.FC<CommentsProps> = ({ artId, artName, commentingDisabled }) => {
  return (
    <div className="w-full mt-6 sm:px-20">
      <h2 className="text-lg font-semibold mb-3 text-zinc-100">Comments</h2>
      {!commentingDisabled ? (
        <>
          <CommentInputSection postId={artId} artname={artName} />
          <CommentList postId={artId} />
        </>
      ) : (
        <div className="text-center py-6 text-zinc-500">
          <p>Comments are disabled for this artwork.</p>
        </div>
      )}
    </div>
  );
};

export default Comments;
