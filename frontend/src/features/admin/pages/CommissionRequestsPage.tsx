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
                 <CommissionFilters statusFilter={statusFilter} onStatusChange={setStatusFilter} />
            
            <CommissionTable statusFilter={statusFilter} />
        </AdminPageLayout>
    );
};

export default CommissionRequestsPage;
