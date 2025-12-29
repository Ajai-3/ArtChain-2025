
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Badge } from '../../../../components/ui/badge';
import type { RecentCommission } from '../../hooks/dashboard/useDashboardStats';

interface RecentCommissionsTableProps {
  commissions: RecentCommission[];
}

const RecentCommissionsTable: React.FC<RecentCommissionsTableProps> = ({ commissions }) => {
    
    // Status badges mapping
    const getStatusVariant = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED': return 'default'; // dark/primary
            case 'IN_PROGRESS': return 'secondary';
            case 'AGREED': return 'outline';
            case 'REQUESTED': return 'outline';
            default: return 'outline';
        }
    }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="space-y-1">
            <CardTitle>Recent Commissions</CardTitle>
            <CardDescription>Latest artwork requests</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-muted-foreground">#</TableHead>
              <TableHead>Commission Details</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((comm, index) => (
              <TableRow key={comm.id}>
                <TableCell className="font-medium text-muted-foreground text-xs">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2 py-1">
                    {/* Artist */}
                    <div className="flex items-center gap-2">
                         <div className="h-6 w-6 rounded-full overflow-hidden bg-zinc-200 flex-shrink-0">
                             <img src={(comm as any).artistProfileImage || `https://ui-avatars.com/api/?name=${comm.artistName}&background=random`} alt="" className="h-full w-full object-cover" />
                         </div>
                         <div className="flex flex-col">
                             <span className="text-[10px] uppercase text-muted-foreground leading-none mb-0.5">Artist</span>
                             <span className="font-medium text-sm leading-none">{comm.artistName}</span>
                         </div>
                    </div>

                    {/* Client & Message */}
                    <div className="pl-8 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                             <span className="text-[10px] uppercase text-muted-foreground">Client:</span>
                             <span className="text-xs font-medium">{comm.clientName}</span>
                        </div>
                        <span className="text-xs text-muted-foreground italic truncate max-w-[200px]" title={(comm as any).requestMessage || 'No details'}>
                            "{(comm as any).requestMessage || 'No details'}"
                        </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    <span className="font-mono text-sm">{comm.amount > 0 ? `${comm.amount} AC` : '-'}</span>
                </TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(comm.status) as any} className="text-[10px] px-2 py-0.5 h-6">
                        {comm.status.replace('_', ' ')}
                    </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                    {new Date(comm.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
              </TableRow>
            ))}
             {commissions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No recent commissions
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentCommissionsTable;
