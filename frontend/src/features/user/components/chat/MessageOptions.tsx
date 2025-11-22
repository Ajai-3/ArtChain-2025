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
}

const MessageOptions: React.FC<MessageOptionsProps> = ({
  messageId,
  isOwnMessage,
  isGroup,
  isAdmin,
  onDeleteForMe,
  onDeleteForAll,
  position,
  onClose,
}) => {
  const handleOptionClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute bg-background border border-border rounded-lg shadow-lg py-1 min-w-32 z-50"
        style={{
          left: position.x,
          top: position.y,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isOwnMessage && (
          <>
            <button
              onClick={() => handleOptionClick(onDeleteForMe)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              Delete for me
            </button>
            {(isGroup ? isAdmin : true) && (
              <button
                onClick={() => handleOptionClick(onDeleteForAll)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors text-red-600"
              >
                Delete for all
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageOptions;
