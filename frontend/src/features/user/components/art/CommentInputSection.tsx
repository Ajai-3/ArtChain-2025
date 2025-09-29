import React, { useState } from "react";
import { usePostComment } from "../../hooks/art/usePostComment";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { SendHorizonal, User } from "lucide-react";
import CustomLoader from "../../../../components/CustomLoader";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

interface Props {
  postId: string;
  artname: string;
}

const CommentInputSection: React.FC<Props> = ({ postId, artname }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [comment, setComment] = useState("");
  const mutation = usePostComment();

  const handleSend = () => {
    const trimmed = comment.trim();
    if (trimmed.length === 0 || trimmed.length > 500) return;
    mutation.mutate({ postId, artname, content: trimmed });
    setComment("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 500) setComment(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative w-full flex flex-col">
      <div className="relative w-full">
        {/* Profile image inside input */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-600"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-600 dark:bg-zinc-800 flex items-center justify-center text-white">
              {user?.name?.charAt(0).toUpperCase() || (
                <User className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        <Input
          type="text"
          value={comment}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          variant="search"
          className="py-5 pl-14 pr-10"
        />

        {comment.trim().length > 0 && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            <Button
              onClick={handleSend}
              disabled={mutation.isPending || comment.trim().length === 0}
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent hover:bg-transparent flex items-center justify-center"
            >
              {mutation.isPending ? (
                <CustomLoader />
              ) : (
                <SendHorizonal className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Character counter */}
      <div className="text-xs text-gray-400 mt-1 text-right">
        {comment.length}/500
      </div>
    </div>
  );
};

export default CommentInputSection;
