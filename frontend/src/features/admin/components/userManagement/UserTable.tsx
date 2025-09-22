import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../../components/modals/ConfirmModal";
import CustomLoader from "../../../../components/CustomLoader";
import UserTableSkeleton from "../skeletons/UserTableSkeleton";

interface UserTableProps {
  users: any[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  toggleBan: (userId: string) => void;
  isToggling: (userId: string) => boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  page,
  totalPages,
  limit,
  onPageChange,
  toggleBan,
  isToggling,
}) => {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [actionType, setActionType] = React.useState<"ban" | "unban">("ban");

  const openConfirmModal = (user: any) => {
    setSelectedUser(user);
    setActionType(user.status === "banned" ? "unban" : "ban");
    setIsConfirmOpen(true);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const visiblePages = 3;
    let startPage = Math.max(page - 1, 1);
    let endPage = Math.min(startPage + visiblePages - 1, totalPages);

    if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={() => onPageChange(1)}
        >
          First
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>

        {startPage > 1 && <span className="px-2">...</span>}
        {pages.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "default" : "outline"}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        {endPage < totalPages && <span className="px-2">...</span>}

        <Button
          size="sm"
          variant="outline"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </Button>
      </div>
    );
  };

  return (
<>    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-zinc-900">
            <TableHead className="px-2 py-2 text-left">No</TableHead>
            <TableHead className="px-4 py-2 text-left">Name</TableHead>
            <TableHead className="px-4 py-2 text-left">Email</TableHead>
            <TableHead className="px-4 py-2 text-left">Plan</TableHead>
            <TableHead className="px-4 py-2 text-left">Role</TableHead>
            <TableHead className="px-4 py-2 text-left">Joined At</TableHead>
            <TableHead className="px-4 py-2 text-left">Status</TableHead>
            <TableHead className="px-4 py-2 text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <UserTableSkeleton rows={limit} />
          ) : users && users.length > 0 ? (
            users.map((user: any, idx: number) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                <TableCell className="flex items-center gap-3 px-4 py-2">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt=""
                      className="w-14 h-14 rounded-sm"
                    />
                  ) : (
                    <User className="w-14 h-14 p-2 bg-zinc-800 rounded-sm" />
                  )}
                  <div className="">
                    <p>{user.name || "-"} </p>
                    <p className="text-zinc-400">{user.username || "-"}</p>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2">{user.email || "-"}</TableCell>
                <TableCell className="px-4 py-2 capitalize">
                  <span
                    className={`inline-block w-20 text-center py-[.2rem] rounded-full text-xs font-semibold ${
                      user.plan === "free"
                        ? "bg-lime-600"
                        : user.plan === "pro"
                        ? "bg-blue-600"
                        : user.plan === "pro_plus"
                        ? "bg-purple-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {user.plan || "-"}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-2 capitalize">
                  <span
                    className={`inline-block w-20 text-center py-[.2rem] rounded-full text-xs font-semibold ${
                      user.role === "user"
                        ? "bg-cyan-600"
                        : user.role === "artist"
                        ? "bg-pink-600"
                        : "bg-gray-900"
                    }`}
                  >
                    {user.role || "-"}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-2">
                  {user.createdAt ? (
                    <>
                      <div>
                        {format(new Date(user.createdAt), "MMMM d, yyyy")}
                      </div>
                      <div>{format(new Date(user.createdAt), "hh:mm a")}</div>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <span
                    className={`inline-block w-16 text-center py-[.2rem] rounded-full text-xs font-semibold ${
                      user.status === "banned"
                        ? "bg-red-700/30 text-red-600"
                        : "bg-green-700/30 text-green-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div className="flex items-center ">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-[.7rem] mr-2"
                      onClick={() => navigate(`/${user.username}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant={
                        user.status === "banned" ? "outline" : "destructive"
                      }
                      size="sm"
                      disabled={isToggling(user.id)}
                      onClick={() => openConfirmModal(user)}
                      className="inline-block w-14 bg-red-600"
                    >
                      {isToggling(user.id) ? (
                        <CustomLoader size={16} />
                      ) : user.status === "banned" ? (
                        "Unban"
                      ) : (
                        "Ban"
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={`Confirm ${actionType}`}
        description={
          actionType === "ban"
            ? `Are you sure you want to ban ${selectedUser?.name}? This will temporarily restrict their access to the platform. You can unban them later if needed.`
            : `Are you sure you want to unban ${selectedUser?.name}? This will restore their access to the platform.`
        }
        confirmText={actionType === "ban" ? "Ban" : "Unban"}
        confirmVariant={actionType === "ban" ? "destructive" : "default"}
        onConfirm={() => {
          toggleBan(selectedUser.id);
          setIsConfirmOpen(false);
        }}
        isLoading={isToggling(selectedUser?.id)}
      />

    </div>
      {renderPagination()}
      </>
  );
};

export default UserTable;
