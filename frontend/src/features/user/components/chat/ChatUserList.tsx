import React from "react";

interface ChatUserListProps {
  selectedUser: string | null;
  onSelectUser: (userId: string) => void;
}

const ChatUserList: React.FC<ChatUserListProps> = ({
  selectedUser,
  onSelectUser,
}) => {
  const users = [
    {
      id: "1",
      name: "John Doe",
      username: "johndoe",
      lastMessage: "Hey, how are you doing?",
      timestamp: "2m",
      unread: 2,
      isOnline: true,
      avatarColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      id: "2",
      name: "Sarah Wilson",
      username: "sarahw",
      lastMessage: "See you tomorrow!",
      timestamp: "1h",
      unread: 0,
      isOnline: true,
      avatarColor: "bg-pink-100",
      textColor: "text-pink-600",
    },
    {
      id: "3",
      name: "Mike Johnson",
      username: "mikej",
      lastMessage: "Thanks for the help!",
      timestamp: "3h",
      unread: 1,
      isOnline: false,
      avatarColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      id: "4",
      name: "Emma Davis",
      username: "emmad",
      lastMessage: "The meeting was great!",
      timestamp: "5h",
      unread: 0,
      isOnline: true,
      avatarColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      id: "5",
      name: "Alex Brown",
      username: "alexb",
      lastMessage: "Check out this design!",
      timestamp: "1d",
      unread: 3,
      isOnline: false,
      avatarColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-muted/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`flex items-center p-3 cursor-pointer transition-colors border-b border-border hover:bg-muted/50 ${
              selectedUser === user.id ? "bg-muted" : ""
            }`}
          >
            <div className="relative flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${user.avatarColor}`}
              >
                <span className={`text-sm font-medium ${user.textColor}`}>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                  user.isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>

            <div className="flex-1 ml-3 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {user.timestamp}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate pr-2">
                  {user.lastMessage}
                </p>
                {user.unread > 0 && (
                  <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-medium">
                      {user.unread}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatUserList;
