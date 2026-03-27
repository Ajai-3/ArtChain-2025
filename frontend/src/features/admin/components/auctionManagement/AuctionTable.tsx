import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';
import { Button } from '../../../../components/ui/button';
import { Eye, Trash2, Gavel } from 'lucide-react';
import { format, formatDistance } from 'date-fns';
import ConfirmModal from '../../../../components/modals/ConfirmModal';
import { useCancelAuction } from '../../hooks/auctionManagement/useCancelAuction';
import { useSettleAuction } from '../../hooks/auctionManagement/useSettleAuction';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface AuctionTableProps {
  auctions: any[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onViewDetails: (auction: any) => void;
}

const AuctionTable: React.FC<AuctionTableProps> = ({
  auctions,
  isLoading,
  page,
  totalPages,
  limit,
  onPageChange,
  onViewDetails,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(
    null,
  );

  const { mutate: cancelAuction, isPending: isCanceling } = useCancelAuction();
  const { mutate: settleAuction, isPending: isSettling } = useSettleAuction();

  const handleSettleClick = (id: string) => {
    settleAuction(id);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedAuctionId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAuctionId) {
      cancelAuction(selectedAuctionId, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedAuctionId(null);
        },
      });
    }
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
            variant={p === page ? 'default' : 'outline'}
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
      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-zinc-900/50">
              <TableHead className="px-4 py-3 w-[50px]">No</TableHead>
              <TableHead className="px-4 py-3 text-left">Auction</TableHead>
              <TableHead className="px-4 py-3 text-left">Price / Bid</TableHead>
              <TableHead className="px-4 py-3 text-left">Duration</TableHead>
              <TableHead className="px-4 py-3 text-left">Status</TableHead>
              <TableHead className="px-4 py-3 text-left">Payment</TableHead>
              <TableHead className="px-4 py-3 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : auctions && auctions.length > 0 ? (
              auctions.map((auction, index) => (
                <TableRow
                  key={auction._id || auction.id}
                  className="hover:bg-gray-100 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <TableCell className="px-4 py-3 font-medium text-zinc-500">
                    {(page - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Placeholder image logic - needs proper mapCdnUrl */}
                      <div className="w-12 h-12 rounded bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                        {auction.imageKey && (
                          <img
                            src={auction.imageKey}
                            alt={auction.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-col max-w-[180px]">
                        <span
                          className="font-medium truncate"
                          title={auction.title}
                        >
                          {auction.title}
                        </span>
                        <span className="text-xs text-zinc-500 truncate">
                          by {auction.host?.username || 'unknown'}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium">
                        Bid:{' '}
                        <span className="text-green-600 dark:text-green-400">
                          {auction.currentBid || 0} AC
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500">
                        Start: {auction.startPrice} AC
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className="flex flex-col gap-1 text-xs text-zinc-500">
                      {auction.status === 'ACTIVE' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Ends{' '}
                          {formatDistance(
                            new Date(auction.endTime),
                            new Date(),
                            { addSuffix: true },
                          )}
                        </span>
                      ) : auction.status === 'SCHEDULED' ? (
                        <span className="text-indigo-600 dark:text-indigo-400">
                          Starts{' '}
                          {formatDistance(
                            new Date(auction.startTime),
                            new Date(),
                            { addSuffix: true },
                          )}
                        </span>
                      ) : auction.status === 'CANCELLED' ? (
                        <span className="text-red-600 dark:text-red-400">
                          Cancelled{' '}
                          {formatDistance(
                            new Date(auction.updatedAt || auction.createdAt),
                            new Date(),

                            { addSuffix: true },
                          )}
                        </span>
                      ) : auction.status === 'ENDED' ? (
                        <span className="text-yellow-600 dark:text-yellow-400">
                          Ended{' '}
                          {formatDistance(
                            new Date(auction.endTime),
                            new Date(),
                            { addSuffix: true },
                          )}
                        </span>
                      ) : (
                        <span className="text-zinc-400">
                          Ended{' '}
                          {formatDistance(
                            new Date(auction.endTime),
                            new Date(),
                            { addSuffix: true },
                          )}
                        </span>
                      )}

                      <div className="text-[10px] text-zinc-400 mt-1">
                        {format(new Date(auction.startTime), 'MMM d, h:mm a')} -{' '}
                        {format(new Date(auction.endTime), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        auction.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                          : auction.status === 'SCHEDULED'
                            ? 'bg-blue-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800'
                            : auction.status === 'ENDED'
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                              : auction.status === 'UNSOLD'
                                ? 'bg-red-100 text-gray-700 border-red-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800'
                                : auction.status === 'CANCELLED'
                                  ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                                  : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900/30 dark:text-zinc-400 dark:border-zinc-800'
                      }`}
                    >
                      {auction.status}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    {auction.status === 'ENDED' || auction.status === 'CANCELLED' ? (
                      <div className="flex items-center gap-1.5 min-w-[100px]">
                        {auction.paymentStatus === 'SUCCESS' ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Success</span>
                          </div>
                        ) : auction.paymentStatus === 'PENDING' ? (
                          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium">Pending</span>
                          </div>
                        ) : auction.paymentStatus === 'FAILED' ? (
                          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Failed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">None</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400 italic">Pre-Settlement</span>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => onViewDetails(auction)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {auction.status !== 'ENDED' &&
                        auction.status !== 'CANCELLED' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            onClick={() =>
                              handleDeleteClick(auction._id || auction.id)
                            }
                            title="Cancel Auction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}

                      {auction.status === 'ENDED' &&
                        auction.paymentStatus !== 'SUCCESS' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 flex items-center gap-2 border-emerald-500/50 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 dark:border-emerald-800/50"
                            onClick={() =>
                              handleSettleClick(auction._id || auction.id)
                            }
                            disabled={isSettling}
                            title="Manually Settle Auction Funds"
                          >
                            <Gavel className="w-3.5 h-3.5" />
                            <span className="text-xs">
                              {isSettling ? 'Settling...' : 'Settle'}
                            </span>
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-zinc-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Gavel className="w-8 h-8 opacity-20" />
                    <p>No auctions found</p>
                  </div>
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
        title="Cancel Auction"
        description="Are you sure you want to cancel this auction? This action cannot be undone."
        confirmText={isCanceling ? 'Canceling...' : 'Cancel Auction'}
        cancelText="Keep Active"
        confirmVariant="destructive"
        isLoading={isCanceling}
      />
    </>
  );
};

export default AuctionTable;
