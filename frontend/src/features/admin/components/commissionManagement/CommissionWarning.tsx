import React from 'react';
import { Card, CardContent } from "../../../../components/ui/card";
import { AlertTriangle } from 'lucide-react';

const CommissionWarning: React.FC = () => {
    return (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="pt-6">
                <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                            Important: Handle Commission Changes Carefully
                        </p>
                        <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1 list-disc list-inside">
                            <li>Changing commission rates frequently can confuse users and damage trust</li>
                            <li>New rates only apply to NEW operations (auctions/sales created after the change)</li>
                            <li>Ongoing auctions and sales will use the rate that was active when they were created</li>
                            <li>Consider the impact on user experience before making changes</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CommissionWarning;
