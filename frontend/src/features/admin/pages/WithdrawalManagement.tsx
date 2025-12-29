import React, { useState } from "react";
import WithdrawalTable from "../components/withdrawal/WithdrawalTable";
import WithdrawalDetailModal from "../components/withdrawal/WithdrawalDetailModal";
import WithdrawalStatsCards from "../components/withdrawal/WithdrawalStatsCards";
import WithdrawalStatusFilter from "../components/withdrawal/WithdrawalStatusFilter";
import { useGetAllWithdrawalRequests } from "../hooks/withdrawal/useGetAllWithdrawalRequests";
import AdminPageLayout from "../components/common/AdminPageLayout";
import { useBulkUpdateWithdrawalStatus } from "../hooks/withdrawal/useBulkUpdateWithdrawalStatus";
import { Button } from "../../../components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";

const WithdrawalManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  
  const { data, isLoading } = useGetAllWithdrawalRequests({ 
    page, 
    limit: 5,
    status: statusFilter 
  });
  const withdrawals = data?.withdrawalRequests || [];
  const totalPages = data?.totalPages || 0;
  const totalCount = data?.totalCount || 0;
  const statusCounts = data?.statusCounts || {};

  const { mutate: bulkUpdate, isPending: isBulkUpdating } = useBulkUpdateWithdrawalStatus();

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED">("APPROVED");

  const handleBulkAction = (status: "APPROVED" | "REJECTED") => {
    if (selectedIds.length === 0) return;
    
    setActionType(status);
    
    if (status === "REJECTED") {
      setIsRejectModalOpen(true);
    } else {
      setIsConfirmOpen(true);
    }
  };

  const confirmBulkAction = () => {
    bulkUpdate(
        { withdrawalIds: selectedIds, status: actionType, rejectionReason: actionType === "REJECTED" ? rejectionReason : undefined },
        {
            onSuccess: () => {
                setSelectedIds([]);
                setIsConfirmOpen(false);
                setIsRejectModalOpen(false);
                setRejectionReason("");
            }
        }
    );
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1); // Reset to first page when filter changes
    setSelectedIds([]); // Clear selections when filter changes
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
      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap pb-6">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1 || isLoading}
          onClick={() => setPage(1)}
        >
          First
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1 || isLoading}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Prev
        </Button>

        {startPage > 1 && <span className="px-2">...</span>}
        {pages.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "default" : "outline"}
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        ))}
        {endPage < totalPages && <span className="px-2">...</span>}

        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages || isLoading}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages || isLoading}
          onClick={() => setPage(totalPages)}
        >
          Last
        </Button>
      </div>
    );
  };

  return (
    <AdminPageLayout
      title="Withdrawal Management"
      description="Manage and process withdrawal requests"
    >
        {/* Stats Cards */}
        <WithdrawalStatsCards totalCount={totalCount} statusCounts={statusCounts} />

        {/* Filter Section */}
        <WithdrawalStatusFilter
          statusFilter={statusFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-4 border border-zinc-700 animate-in fade-in slide-in-from-bottom-4">
                <span className="font-medium">{selectedIds.length} Selected</span>
                <div className="h-4 w-px bg-zinc-700"></div>
                <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                    onClick={() => handleBulkAction("APPROVED")}
                    disabled={isBulkUpdating}
                >
                    {isBulkUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Approve Selected
                </Button>
                <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleBulkAction("REJECTED")}
                    disabled={isBulkUpdating}
                >
                    {isBulkUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <XCircle className="w-4 h-4 mr-2" />}
                    Reject Selected
                </Button>
                 <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setSelectedIds([])}
                    disabled={isBulkUpdating}
                    className="hover:bg-white/10 text-white hover:text-white"
                >
                    Cancel
                </Button>
            </div>
        )}

        <WithdrawalTable
          withdrawals={withdrawals} 
          isLoading={isLoading}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onViewDetails={(withdrawal) => setSelectedWithdrawal(withdrawal)}
        />
        
        {renderPagination()}

        {/* Detail Modal */}
        {selectedWithdrawal && (
          <WithdrawalDetailModal
            withdrawal={selectedWithdrawal}
            isOpen={!!selectedWithdrawal}
            onClose={() => setSelectedWithdrawal(null)}
          />
        )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={`Confirm ${actionType === "APPROVED" ? "Approval" : "Rejection"}`}
        description={`Are you sure you want to ${actionType === "APPROVED" ? "approve" : "reject"} ${selectedIds.length} selected withdrawal requests?`}
        confirmText={actionType === "APPROVED" ? "Approve" : "Reject"}
        confirmVariant={actionType === "APPROVED" ? "default" : "destructive"}
        onConfirm={confirmBulkAction}
        isLoading={isBulkUpdating}
      />

      {/* Rejection Reason Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Reject Withdrawal Requests</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You are about to reject {selectedIds.length} withdrawal request{selectedIds.length > 1 ? 's' : ''}. 
              Please provide a reason for rejection.
            </p>
            <div className="space-y-2">
              <Label htmlFor="bulkRejectionReason">Rejection Reason *</Label>
              <Textarea
                id="bulkRejectionReason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionReason("");
              }}
              disabled={isBulkUpdating}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBulkAction}
              disabled={isBulkUpdating || !rejectionReason.trim()}
            >
              {isBulkUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <XCircle className="w-4 h-4 mr-2" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
};

export default WithdrawalManagement;
