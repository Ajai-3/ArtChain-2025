import { useState } from "react";
import AuctionFilters from "../components/auctionManagement/AuctionFilters";
import AuctionTable from "../components/auctionManagement/AuctionTable";
import { useGetAllAuctions } from "../hooks/auctionManagement/useGetAllAuctions";
import AuctionDetailModal from "../components/auctionManagement/AuctionDetailModal";
import AdminPageLayout from "../components/common/AdminPageLayout";
import AuctionStats from "../components/auctionManagement/AuctionStats";

import type { DateRange } from "react-day-picker";

const AuctionManagement = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const limit = 5;

 
  const { data: auctionsData, isLoading: isAuctionsLoading } = useGetAllAuctions(page, limit, {
    status,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  });

  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleViewDetails = (auction: any) => {
      setSelectedAuctionId(auction._id || auction.id);
      setDetailModalOpen(true);
  };

  return (
    <AdminPageLayout
      title="Auction Management"
      description="Monitor and manage all auctions on the platform"
    >
      <div className="mb-8">
        <AuctionStats stats={auctionsData?.data?.stats || { active: 0, ended: 0, sold: 0, unsold: 0 }} />
      </div>

      <div className="mt-6">
        <AuctionFilters
          status={status}
          onStatusChange={setStatus}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <AuctionTable
          auctions={auctionsData?.data?.auctions || []}
          isLoading={isAuctionsLoading}
          page={page}
          totalPages={Math.ceil((auctionsData?.data?.total || 0) / limit)}
          limit={limit}
          onPageChange={setPage}
          onViewDetails={handleViewDetails}
        />
      </div>

      <AuctionDetailModal 
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        auctionId={selectedAuctionId}
      />
    </AdminPageLayout>
  );
};

export default AuctionManagement;
