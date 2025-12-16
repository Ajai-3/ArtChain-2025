import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AdminPageLayout from '../components/common/AdminPageLayout';
import CustomLoader from '../../../components/CustomLoader';
import CommissionWarning from '../components/commissionManagement/CommissionWarning';
import CommissionStatsCards from '../components/commissionManagement/CommissionStatsCards';
import CommissionForm from '../components/commissionManagement/CommissionForm';
import { platformConfigSchema,type  PlatformConfigFormValues } from '../schema/platformConfigSchema';
import { useCommissionConfigQuery } from '../hooks/commissionManagement/useCommissionConfigQuery';
import { useUpdateCommissionConfigMutation } from '../hooks/commissionManagement/useUpdateCommissionConfigMutation';

const CommissionManagement: React.FC = () => {
    const { data: config, isLoading } = useCommissionConfigQuery();
    const updateMutation = useUpdateCommissionConfigMutation();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm<PlatformConfigFormValues>({
        resolver: zodResolver(platformConfigSchema),
    });

    useEffect(() => {
        if (config) {
            reset({
                auctionCommissionPercentage: config.auctionCommissionPercentage,
                artSaleCommissionPercentage: config.artSaleCommissionPercentage,
                welcomeBonus: config.welcomeBonus,
                referralBonus: config.referralBonus,
                artCoinRate: config.artCoinRate,
            });
        }
    }, [config, reset]);

    const onSubmit = (values: PlatformConfigFormValues) => {
        updateMutation.mutate(values);
    };

    if (isLoading) return <div className='flex h-full w-full items-center justify-center'><CustomLoader/></div>;

    return (
        <AdminPageLayout
            title="Commission Management"
            description="Configure platform commission rates and settings"
        >
                <CommissionStatsCards config={config || null} />

            <CommissionForm
                config={config || null}
                updating={updateMutation.isPending}
                hasChanges={isDirty}
                onSubmit={onSubmit}
                register={register}
                handleSubmit={handleSubmit}
                watch={watch}
                errors={errors}
            />

            <div className="mt-4">
                <CommissionWarning />
            </div>
        </AdminPageLayout>
    );
};

export default CommissionManagement;
