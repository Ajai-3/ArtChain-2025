import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';
import ConfirmModal from '../../../../components/modals/ConfirmModal';
import { type PlatformConfigFormValues } from '../../schema/platformConfigSchema';

interface PlatformConfig {
    auctionCommissionPercentage: number;
    artSaleCommissionPercentage: number;
    commissionArtPercentage: number;
    welcomeBonus: number;
    referralBonus: number;
    artCoinRate: number;
}

interface CommissionFormProps {
    config: PlatformConfig | null;
    updating: boolean;
    hasChanges: boolean;
    onSubmit: (values: PlatformConfigFormValues) => void;
    register: ReturnType<typeof useForm<PlatformConfigFormValues>>['register'];
    handleSubmit: ReturnType<typeof useForm<PlatformConfigFormValues>>['handleSubmit'];
    watch: ReturnType<typeof useForm<PlatformConfigFormValues>>['watch'];
    errors: ReturnType<typeof useForm<PlatformConfigFormValues>>['formState']['errors'];
}

type SettingType = 'auctionCommission' | 'artSaleCommission' | 'commissionArtPercentage' | 'welcomeBonus' | 'referralBonus' | 'artCoinRate';

const CommissionForm: React.FC<CommissionFormProps> = ({
    config,
    updating,
    onSubmit,
    register,
    handleSubmit,
    watch,
    errors,
}) => {
    const [selectedSetting, setSelectedSetting] = useState<SettingType>('auctionCommission');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingValues, setPendingValues] = useState<PlatformConfigFormValues | null>(null);

    const currentArtCoinRate = watch('artCoinRate') || config?.artCoinRate || 10;

    const settings = [
        { id: 'auctionCommission' as SettingType, label: 'Auction Commission', unit: '%' },
        { id: 'artSaleCommission' as SettingType, label: 'Art Sale Commission', unit: '%' },
        { id: 'commissionArtPercentage' as SettingType, label: 'Commission Art', unit: '%' },
        { id: 'welcomeBonus' as SettingType, label: 'Welcome Bonus', unit: 'AC' },
        { id: 'referralBonus' as SettingType, label: 'Referral Bonus', unit: 'AC' },
        { id: 'artCoinRate' as SettingType, label: 'Art Coin Rate', unit: '₹/AC' },
    ];

    const getFieldName = (settingId: SettingType): keyof PlatformConfigFormValues => {
        const map: Record<SettingType, keyof PlatformConfigFormValues> = {
            auctionCommission: 'auctionCommissionPercentage',
            artSaleCommission: 'artSaleCommissionPercentage',
            commissionArtPercentage: 'commissionArtPercentage',
            welcomeBonus: 'welcomeBonus',
            referralBonus: 'referralBonus',
            artCoinRate: 'artCoinRate',
        };
        return map[settingId];
    };

    const getCurrentValue = (settingId: SettingType): number => {
        if (!config) return 0;
        const fieldName = getFieldName(settingId);
        return config[fieldName];
    };

    const handleFormSubmit = (values: PlatformConfigFormValues) => {
        // Only submit the selected field
        const fieldName = getFieldName(selectedSetting);
        const dataToSubmit = { [fieldName]: values[fieldName] };
        setPendingValues(dataToSubmit as PlatformConfigFormValues);
        setShowConfirmModal(true);
    };

    const handleConfirm = () => {
        if (pendingValues) {
            onSubmit(pendingValues);
        }
        setShowConfirmModal(false);
        setPendingValues(null);
    };

    const selectedFieldName = getFieldName(selectedSetting);
    const selectedSettingInfo = settings.find(s => s.id === selectedSetting)!;
    
    // Watch the selected field value
    const currentInputValue = watch(selectedFieldName);
    const currentStoredValue = getCurrentValue(selectedSetting);
    
    // Check if value has changed
    const hasValueChanged = currentInputValue !== undefined && 
                           currentInputValue !== null && 
                           Number(currentInputValue) !== currentStoredValue;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Update Settings</CardTitle>
                    <CardDescription>
                        Select the setting you want to update and enter the new value.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center space-x-10">
                    {/* Radio Group */}
                    <RadioGroup value={selectedSetting} onValueChange={(value) => setSelectedSetting(value as SettingType)}>
                        <div className="space-y-2">
                            {settings.map((setting) => (
                                <div key={setting.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={setting.id} id={setting.id} />
                                    <Label htmlFor={setting.id} className="cursor-pointer flex-1">
                                        {setting.label} ({setting.unit})
                                        <span className="ml-2 text-sm text-muted-foreground">
                                            Current: {getCurrentValue(setting.id)}
                                        </span>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>

                    {/* Selected Input */}
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={selectedFieldName}>
                                New {selectedSettingInfo.label} ({selectedSettingInfo.unit})
                            </Label>
                            <Input 
                                id={selectedFieldName}
                                type="number" 
                                step="0.1"
                                placeholder={getCurrentValue(selectedSetting).toString()}
                                {...register(selectedFieldName)} 
                            />
                            {selectedSetting === 'artCoinRate' && (
                                <p className="text-sm text-muted-foreground">
                                    1 AC = ₹{currentArtCoinRate}
                                </p>
                            )}
                            {errors[selectedFieldName] && (
                                <p className="text-sm text-red-500">{errors[selectedFieldName]?.message}</p>
                            )}
                        </div>
                        
                        <Button type="submit" disabled={updating || !hasValueChanged}>
                            {updating ? "Updating..." : hasValueChanged ? "Update" : "No Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Confirm Change"
                description={`Are you sure you want to update ${selectedSettingInfo.label}? This will affect all new operations.`}
                confirmText="Yes, Update"
                confirmVariant="default"
                onConfirm={handleConfirm}
            />
        </>
    );
};

export default CommissionForm;
