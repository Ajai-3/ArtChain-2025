import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AdminPageLayout from '../components/common/AdminPageLayout';
import StatsCard from '../components/common/StatsCard';
import { usePlatformConfig } from '../hooks/platformConfig/usePlatformConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import CustomLoader from '../../../components/CustomLoader';
import { Gavel, ShoppingCart, Gift, Coins } from 'lucide-react';

const formSchema = z.object({
    auctionCommissionPercentage: z.coerce.number().min(0).max(100),
    artSaleCommissionPercentage: z.coerce.number().min(0).max(100),
    welcomeBonus: z.coerce.number().min(0),
    artCoinRate: z.coerce.number().min(1),
});

const PlatformSettings: React.FC = () => {
    const { config, loading, updating, updateConfig } = usePlatformConfig();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (config) {
            reset({
                auctionCommissionPercentage: config.auctionCommissionPercentage,
                artSaleCommissionPercentage: config.artSaleCommissionPercentage,
                welcomeBonus: config.welcomeBonus,
                artCoinRate: config.artCoinRate,
            });
        }
    }, [config, reset]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        updateConfig(values);
    };

    if (loading) return <div className='flex h-full w-full items-center justify-center'><CustomLoader/></div>;

    const stats = [
        {
            title: 'Auction Commission',
            value: `${config?.auctionCommissionPercentage || 0}%`,
            icon: Gavel,
            iconColor: 'text-purple-500',
            iconBgColor: 'bg-purple-500/10',
        },
        {
            title: 'Art Sale Commission',
            value: `${config?.artSaleCommissionPercentage || 0}%`,
            icon: ShoppingCart,
            iconColor: 'text-blue-500',
            iconBgColor: 'bg-blue-500/10',
        },
        {
            title: 'Welcome Bonus',
            value: `${config?.welcomeBonus || 0} AC`,
            icon: Gift,
            iconColor: 'text-green-500',
            iconBgColor: 'bg-green-500/10',
        },
        {
            title: 'Art Coin Rate',
            value: `₹${config?.artCoinRate || 10}/AC`,
            icon: Coins,
            iconColor: 'text-yellow-500',
            iconBgColor: 'bg-yellow-500/10',
        },
    ];

    return (
        <AdminPageLayout
            title="Platform Settings"
            description="Configure global platform settings and commission rates"
        >
            {/* Current Settings Stats */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Current Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <StatsCard key={stat.title} {...stat} />
                    ))}
                </div>
            </div>

            {/* Edit Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Update Platform Settings</CardTitle>
                    <CardDescription>
                        Changes will only affect new operations. Ongoing auctions and sales use the commission rate from when they were created.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="auctionCommissionPercentage">Auction Commission (%)</Label>
                                <Input 
                                    id="auctionCommissionPercentage" 
                                    type="number" 
                                    step="0.1" 
                                    placeholder="2.5" 
                                    {...register("auctionCommissionPercentage")} 
                                />
                                {errors.auctionCommissionPercentage && (
                                    <p className="text-sm text-red-500">{errors.auctionCommissionPercentage.message}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Percentage deducted from winning bid amount
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="artSaleCommissionPercentage">Art Sale Commission (%)</Label>
                                <Input 
                                    id="artSaleCommissionPercentage" 
                                    type="number" 
                                    step="0.1" 
                                    placeholder="5.0" 
                                    {...register("artSaleCommissionPercentage")} 
                                />
                                {errors.artSaleCommissionPercentage && (
                                    <p className="text-sm text-red-500">{errors.artSaleCommissionPercentage.message}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Percentage deducted from art sale price
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="welcomeBonus">Welcome Bonus (Art Coins)</Label>
                                <Input 
                                    id="welcomeBonus" 
                                    type="number" 
                                    placeholder="100" 
                                    {...register("welcomeBonus")} 
                                />
                                {errors.welcomeBonus && (
                                    <p className="text-sm text-red-500">{errors.welcomeBonus.message}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Art Coins given to new users
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="artCoinRate">Art Coin Rate (₹/AC)</Label>
                                <Input 
                                    id="artCoinRate" 
                                    type="number" 
                                    step="0.1" 
                                    placeholder="10" 
                                    {...register("artCoinRate")} 
                                />
                                {errors.artCoinRate && (
                                    <p className="text-sm text-red-500">{errors.artCoinRate.message}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    1 Art Coin = ₹{config?.artCoinRate || 10}
                                </p>
                            </div>
                        </div>
                        
                        <Button type="submit" disabled={updating}>
                            {updating ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AdminPageLayout>
    );
};

export default PlatformSettings;
