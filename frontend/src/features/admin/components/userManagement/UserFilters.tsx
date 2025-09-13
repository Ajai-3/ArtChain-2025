import React from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { FileDown } from "lucide-react";
import ArtistRequestsModal from "./ArtistRequestModal";

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  userTypeFilter: string;
  setUserTypeFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  search,
  onSearchChange,
  roleFilter,
  setRoleFilter,
  userTypeFilter,
  setUserTypeFilter,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg mb-3 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <Input
        type="text"
        placeholder="Search by name, email, or username..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        variant="green-focus"
        className="w-full sm:w-1/3"
      />

      <Select onValueChange={setRoleFilter} defaultValue={roleFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Plans</SelectItem>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="pro_plus">Pro Plus</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setUserTypeFilter} defaultValue={userTypeFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="artist">Artist</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="banned">Banned</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="deleted">Deleted</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2 mt-2 sm:mt-0">
        <ArtistRequestsModal />
        <Button>
          <FileDown />
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;
