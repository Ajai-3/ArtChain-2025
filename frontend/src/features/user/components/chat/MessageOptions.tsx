// components/chat/MessageOptions.tsx
import React from "react";

interface MessageOptionsProps {
  messageId: string;
  isOwnMessage: boolean;
  isGroup: boolean;
  isAdmin: boolean;
  onDeleteForMe: () => void;
  onDeleteForAll: () => void;
  position: { x: number; y: number };
  onClose: () => void;
  isCurrentUser: boolean;
  locked?: boolean;
}

const MessageOptions: React.FC<MessageOptionsProps> = ({
  // messageId,
  isOwnMessage,
  isGroup,
  isAdmin,
  onDeleteForMe,
  onDeleteForAll,
  position,
  onClose,
  isCurrentUser,
  locked,
}) => {
  const handleOptionClick = (action: () => void) => {
    if (locked) return;
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute bg-popover border border-border rounded-md shadow-lg py-1 min-w-[160px] z-50"
        style={{
          left: isCurrentUser 
            ? Math.max(10, position.x - 160) // Left side for right messages
            : Math.min(position.x, window.innerWidth - 170), // Right side for left messages
          top: Math.min(position.y, window.innerHeight - 120),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isOwnMessage && (
          <button
            onClick={() => handleOptionClick(onDeleteForMe)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            Delete for me
          </button>
        )}
        {(isOwnMessage || (isGroup && isAdmin)) && (
          <button
            onClick={() => handleOptionClick(onDeleteForAll)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors text-red-600"
          >
            Delete for all
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageOptions;
