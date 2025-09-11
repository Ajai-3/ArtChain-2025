import React, { useState } from "react";
import { usePostComment } from "../../hooks/art/usePostComment";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { SendHorizonal } from "lucide-react";
import CustomLoader from "../../../../components/CustomLoader";

interface Props {
  postId: string;
}

const CommentInputSection: React.FC<Props> = ({ postId }) => {
  const [comment, setComment] = useState("");
  const mutation = usePostComment();

  const handleSend = () => {
    const trimmed = comment.trim();
    if (trimmed.length === 0 || trimmed.length > 500) return;
    mutation.mutate({ postId, content: trimmed });
    setComment("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 500) {
      setComment(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent form submission or new line
      handleSend();
    }
  };

  return (
    <div className="relative w-full flex flex-col">
      <div className="relative w-full">
        <Input
          type="text"
          value={comment}
          onChange={handleChange}
          onKeyDown={handleKeyDown} // added Enter key support
          placeholder="Write a comment..."
          variant="search"
          className="rounded-full pr-12 w-full"
        />

        {/* Send icon or loader */}
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
