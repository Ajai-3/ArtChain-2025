import { useState, useCallback } from "react";
import { useUnifiedSearch } from "../search/useUnifiedSearch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../redux/selectors/userSelectors";
import apiClient from "../../../../api/axios";

export const useCreateGroupModal = () => {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const currentUser = useSelector(selectCurrentUser);

  const { data: searchResults, isLoading: isSearching } = useUnifiedSearch(
    searchQuery,
    "user"
  );

  const handleUserSelect = useCallback((user: any) => {
    setSelectedUsers((prev) => {
      if (prev.find((u) => u.id === user.id)) return prev;
      return [...prev, user];
    });
    setSearchQuery("");
  }, []);

  const handleUserRemove = useCallback((userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  const handleCreateGroup = useCallback(async (onSuccess: () => void) => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    setIsCreating(true);
    try {
      await apiClient.post("/api/v1/chat/conversation/group", {
        name: groupName,
        memberIds: selectedUsers.map((u) => u.id),
      });
      onSuccess();
      // Reset state
      setGroupName("");
      setSelectedUsers([]);
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to create group:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [groupName, selectedUsers]);

  const resetForm = useCallback(() => {
    setGroupName("");
    setSelectedUsers([]);
    setSearchQuery("");
  }, []);

  return {
    groupName,
    setGroupName,
    searchQuery,
    setSearchQuery,
    selectedUsers,
    isCreating,
    searchResults,
    isSearching,
    currentUser,
    handleUserSelect,
    handleUserRemove,
    handleCreateGroup,
    resetForm,
  };
};
