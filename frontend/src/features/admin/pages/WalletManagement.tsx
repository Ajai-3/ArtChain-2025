import React, { useState } from "react";
import AdminPageLayout from "../components/common/AdminPageLayout";
import { useDebounce } from "../../../hooks/useDebounce";
import WalletFilters from "../components/walletManagement/WalletFilters";
import WalletTable from "../components/walletManagement/WalletTable";
import WalletStats from "../components/walletManagement/WalletStats";
import { useGetAllWallets } from "../hooks/walletManagement/useGetAllWallets";

const WalletManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [rawSearch, setRawSearch] = useState("");
  const debouncedSearch = useDebounce(rawSearch, 500);
  
  const [statusFilter, setStatusFilter] = useState("all");
  const [minBalance, setMinBalance] = useState("");
  const [maxBalance, setMaxBalance] = useState("");

  const limit = 10;

  const { data, isLoading } = useGetAllWallets({
    page,
    limit,
    search: debouncedSearch,
    filters: {
      status: statusFilter,
      minBalance: minBalance ? parseFloat(minBalance) : undefined,
      maxBalance: maxBalance ? parseFloat(maxBalance) : undefined,
    },
  });

  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 0;

  return (
    <AdminPageLayout
      title="Wallet Management"
      description="Manage user wallets, view balances, and monitor transactions"
    >
      {data?.stats && <WalletStats stats={data.stats} />}
      
      <WalletFilters
        search={rawSearch}
        onSearchChange={(value) => {
          setPage(1);
          setRawSearch(value);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(value) => {
          setPage(1);
          setStatusFilter(value);
        }}
        minBalance={minBalance}
        setMinBalance={(value) => {
          setPage(1);
          setMinBalance(value);
        }}
        maxBalance={maxBalance}
        setMaxBalance={(value) => {
          setPage(1);
          setMaxBalance(value);
        }}
      />

      <WalletTable
        wallets={data?.data || []}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={setPage}
      />
    </AdminPageLayout>
  );
};

export default WalletManagement;
