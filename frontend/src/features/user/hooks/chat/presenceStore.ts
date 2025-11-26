// Simple presence tracking - no external dependencies
const onlineUsers = new Set<string>();
const typingUsers = new Map<string, Set<string>>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

export function updateOnlineUsers(users: string[]) {
  onlineUsers.clear();
  users.forEach(id => onlineUsers.add(id));
  notify();
}

export function addTypingUser(conversationId: string, userId: string) {
  if (!typingUsers.has(conversationId)) {
    typingUsers.set(conversationId, new Set());
  }
  typingUsers.get(conversationId)!.add(userId);
  notify();
}

export function removeTypingUser(conversationId: string, userId: string) {
  const set = typingUsers.get(conversationId);
  if (set) {
    set.delete(userId);
    if (set.size === 0) typingUsers.delete(conversationId);
    notify();
  }
}

export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}

export function getTypingUsers(conversationId: string): string[] {
  return Array.from(typingUsers.get(conversationId) || []);
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
