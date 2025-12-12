import React from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Shield, Trash2 } from "lucide-react";

interface MemberActionMenuProps {
  member: any;
  canPromote: boolean;
  canDemote: boolean;
  canRemove: boolean;
  onPromote: () => void;
  onDemote: () => void;
  onRemove: () => void;
}

const MemberActionMenu: React.FC<MemberActionMenuProps> = ({
  canPromote,
  canDemote,
  canRemove,
  onPromote,
  onDemote,
  onRemove,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const newPosition = {
        x: rect.right - 140,
        y: rect.bottom + 5,
      };
      setPosition(newPosition);
    }
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  if (!canPromote && !canDemote && !canRemove) {
    return null;
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
        aria-label="Member options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="fixed bg-popover border border-border rounded-md shadow-lg py-1 min-w-[140px] z-[9999]"
          style={{
            left: Math.max(10, position.x),
            top: position.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {canPromote && (
            <button
              onClick={() => {
                onPromote();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center space-x-2"
            >
              <Shield className="w-3 h-3" />
              <span>Make Admin</span>
            </button>
          )}
          {canDemote && (
            <button
              onClick={() => {
                onDemote();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center space-x-2"
            >
              <Shield className="w-3 h-3 text-orange-500" />
              <span>Remove Admin</span>
            </button>
          )}
          {canRemove && (
            <button
              onClick={() => {
                onRemove();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default MemberActionMenu;
