
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Badge } from '../../../../components/ui/badge';
import type { RecentAuction } from '../../hooks/dashboard/useDashboardStats';
import { Timer } from 'lucide-react';

interface RecentAuctionsTableProps {
  auctions: RecentAuction[];
}

const RecentAuctionsTable: React.FC<RecentAuctionsTableProps> = ({ auctions }) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'ended':
        return <Badge variant="secondary">Ended</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="space-y-1">
            <CardTitle>Recent Auctions</CardTitle>
            <CardDescription>Newest auction listings</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] text-muted-foreground">#</TableHead>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Current Bid</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auctions.map((auction, index) => (
              <TableRow key={auction.id}>
                <TableCell className="font-medium text-muted-foreground text-xs">{index + 1}</TableCell>
                <TableCell>
                  <img src={auction.image || (auction as any).imageKey} alt={auction.title} className="h-10 w-10 rounded-md bg-muted object-cover" />
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">{auction.title}</span>
                        <div className="flex items-center gap-2">
                             {(auction as any).host ? (
                                <div className="flex items-center gap-1.5">
                                    <div className="h-4 w-4 rounded-full overflow-hidden bg-zinc-200">
                                        <img src={(auction as any).host.profileImage || `https://ui-avatars.com/api/?name=${(auction as any).host.name}&background=random`} alt="" className="h-full w-full object-cover" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{(auction as any).host.name}</span>
                                </div>
                             ) : <span className="text-xs text-muted-foreground">Unknown Host</span>}
                             
                             {(auction as any).description && (
                                <>
                                    <span className="text-xs text-muted-foreground/50">•</span>
                                    <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={(auction as any).description}>
                                        {(auction as any).description}
                                    </span>
                                </>
                             )}
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    {auction.currentBid > 0 ? (
                        <span className="font-mono font-medium">{auction.currentBid} AC</span>
                    ) : (
                        <span className="text-xs text-muted-foreground">Start: {auction.startPrice} AC</span>
                    )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                    <div className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {new Date(auction.endTime).toLocaleDateString()}
                    </div>
                </TableCell>
                <TableCell className="text-right">{getStatusBadge(auction.status)}</TableCell>
              </TableRow>
            ))}
             {auctions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No recent auctions
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentAuctionsTable;
