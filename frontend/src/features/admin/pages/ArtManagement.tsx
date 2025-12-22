import React, { useState } from "react";
import ArtStats from "../components/artManagement/ArtStats";
import ArtFilters from "../components/artManagement/ArtFilters";
import ArtTable from "../components/artManagement/ArtTable";
import { useGetAllArts } from "../hooks/artManagement/useGetAllArts";
import { useGetArtStats } from "../hooks/artManagement/useGetArtStats";
import { useDebounce } from "../../../hooks/useDebounce";
import AdminPageLayout from "../components/common/AdminPageLayout";

const ArtManagement = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [postType, setPostType] = useState("all");
  const [priceType, setPriceType] = useState("all");
  
  const debouncedSearch = useDebounce(search, 500);
  const limit = 3;

  const { data: artsData, isLoading: isArtsLoading } = useGetAllArts(page, limit, {
    search: debouncedSearch,
    status,
    postType,
    priceType,
  });

  const { data: statsData } = useGetArtStats();

  return (
    <AdminPageLayout
      title="Art Management"
      description="Manage art posts, monitor engagement, and enforce content policies"
    >
      {statsData && <ArtStats stats={statsData.data} />}

        <ArtFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          postType={postType}
          onPostTypeChange={setPostType}
          priceType={priceType}
          onPriceTypeChange={setPriceType}
        />

        <ArtTable
          arts={artsData?.data || []}
          isLoading={isArtsLoading}
          page={page}
          totalPages={artsData?.meta?.totalPages || 0}
          limit={limit}
          onPageChange={setPage}
        />
    </AdminPageLayout>
  );
};

export default ArtManagement;
