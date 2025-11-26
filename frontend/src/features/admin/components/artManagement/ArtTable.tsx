import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { Eye, Trash2, User, Heart, MessageCircle, Star, Download, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import ConfirmModal from "../../../../components/modals/ConfirmModal";
import { useUpdateArtStatus } from "../../hooks/artManagement/useUpdateArtStatus";
import { useNavigate } from "react-router-dom";

interface ArtTableProps {
  arts: any[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const ArtTable: React.FC<ArtTableProps> = ({
  arts,
  isLoading,
  page,
  totalPages,
  limit,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const { mutate: updateStatus } = useUpdateArtStatus();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [selectedArtId, setSelectedArtId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedArtId(id);
    setDeleteModalOpen(true);
  };

  const handleActivateClick = (id: string) => {
    setSelectedArtId(id);
    setActivateModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedArtId) {
      updateStatus({ id: selectedArtId, status: "deleted" });
      setDeleteModalOpen(false);
      setSelectedArtId(null);
    }
  };

  const confirmActivate = () => {
    if (selectedArtId) {
      updateStatus({ id: selectedArtId, status: "active" });
      setActivateModalOpen(false);
      setSelectedArtId(null);
    }
  };

  const handleViewClick = (username: string, artName: string) => {
    navigate(`/${username}/art/${artName}`);
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
    <>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-zinc-900">
              <TableHead className="px-4 py-2 text-left">Art</TableHead>
              <TableHead className="px-4 py-2 text-left">User</TableHead>
              <TableHead className="px-4 py-2 text-left">Type</TableHead>
              <TableHead className="px-4 py-2 text-left">Price</TableHead>
              <TableHead className="px-4 py-2 text-left">Engagement</TableHead>
              <TableHead className="px-4 py-2 text-left">Status</TableHead>
              <TableHead className="px-4 py-2 text-left">Created At</TableHead>
              <TableHead className="px-4 py-2 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : arts && arts.length > 0 ? (
              arts.map((art) => (
                <TableRow
                  key={art.id}
                  className="hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={art.previewUrl}
                        alt={art.title}
                        className="w-14 h-14 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium truncate max-w-[150px]" title={art.title}>
                          {art.title}
                        </p>
                        <p className="text-xs text-zinc-400 truncate max-w-[150px]">
                          {art.artName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {art.user?.profileImage ? (
                        <img
                          src={art.user.profileImage}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                          <User className="w-3 h-3 text-zinc-400" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{art.user?.name || "Unknown"}</span>
                        <span className="text-xs text-zinc-400">@{art.user?.username || "unknown"}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 capitalize">{art.postType}</TableCell>
                  <TableCell className="px-4 py-2">
                    {art.priceType === "artcoin" ? (
                      <span className="text-yellow-500 font-medium">AC {art.artcoins}</span>
                    ) : art.priceType === "fiat" ? (
                      <span className="text-green-500 font-medium">₹ {art.fiatPrice}</span>
                    ) : (
                      <span className="text-zinc-500">Free/None</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex flex-col gap-1 text-xs text-zinc-500">
                      <div className="flex items-center gap-1" title="Likes">
                        <Heart className="w-3 h-3" /> {art.counts?.likes || 0}
                      </div>
                      <div className="flex items-center gap-1" title="Comments">
                        <MessageCircle className="w-3 h-3" /> {art.counts?.comments || 0}
                      </div>
                      <div className="flex items-center gap-1" title="Favorites">
                        <Star className="w-3 h-3" /> {art.counts?.favorites || 0}
                      </div>
                      <div className="flex items-center gap-1" title="Downloads">
                        <Download className="w-3 h-3" /> {art.counts?.downloads || 0}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        art.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : art.status === "archived"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {art.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm text-zinc-500">
                    {format(new Date(art.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClick(art.user?.username, art.artName)}
                        title="View Art"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {art.status !== "deleted" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(art.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Delete Art"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      {(art.status === "deleted" || art.status === "archived") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleActivateClick(art.id)}
                          className="text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                          title="Activate Art"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No arts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {renderPagination()}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Art"
        description="Are you sure you want to delete this art? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
      />

      <ConfirmModal
        isOpen={activateModalOpen}
        onClose={() => setActivateModalOpen(false)}
        onConfirm={confirmActivate}
        title="Activate Art"
        description="Are you sure you want to activate this art?"
        confirmText="Activate"
        cancelText="Cancel"
        confirmVariant="default"
      />
    </>
  );
};

export default ArtTable;
