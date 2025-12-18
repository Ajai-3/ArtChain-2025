import React from 'react';
import AdminPageLayout from '../components/common/AdminPageLayout';
import CommissionTable from '../components/commissionManagement/CommissionTable';
import CommissionRequestStats from '../components/commissionManagement/CommissionRequestStats';
import CommissionFilters from '../components/commissionManagement/CommissionFilters';

const CommissionRequestsPage: React.FC = () => {
    const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
    return (
        <AdminPageLayout
            title="Commission Requests"
            description="Manage commission requests, track progress, and resolve disputes"
        >
            <CommissionRequestStats />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                 <h3 className="text-lg font-semibold text-zinc-100">All Commissions</h3>
                 <CommissionFilters statusFilter={statusFilter} onStatusChange={setStatusFilter} />
            </div>
            
            <CommissionTable statusFilter={statusFilter} />
        </AdminPageLayout>
    );
};

export default CommissionRequestsPage;
