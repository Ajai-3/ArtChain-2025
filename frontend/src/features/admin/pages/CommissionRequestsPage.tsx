import React from 'react';
import AdminPageLayout from '../components/common/AdminPageLayout';
import CommissionTable from '../components/commissionManagement/CommissionTable';
import CommissionRequestStats from '../components/commissionManagement/CommissionRequestStats';
import CommissionFilters from '../components/commissionManagement/CommissionFilters';

const CommissionRequestsPage: React.FC = () => {
    const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
    const [page, setPage] = React.useState(1);

    return (
        <AdminPageLayout
            title="Commission Requests"
            description="Manage commission requests, track progress, and resolve disputes"
        >
            <CommissionRequestStats />
            <CommissionFilters 
                statusFilter={statusFilter} 
                onStatusChange={(val) => {
                    setStatusFilter(val);
                    setPage(1);
                }} 
            />
            
            <CommissionTable 
                statusFilter={statusFilter} 
                page={page} 
                onPageChange={setPage}
                limit={4}
            />
        </AdminPageLayout>
    );
};

export default CommissionRequestsPage;
