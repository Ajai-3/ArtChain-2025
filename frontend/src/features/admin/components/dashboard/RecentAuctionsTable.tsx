import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import type { RecentAuction } from '../../hooks/dashboard/useDashboardStats';
import { Timer, Download, Loader2 } from 'lucide-react';
import { useDownloadFileMutation } from '../../../user/hooks/art/useDownloadFileMutation';
import { Button } from '../../../../components/ui/button';

interface RecentAuctionsTableProps {
  auctions: RecentAuction[];
}

const statusStyles: Record<string, { text: string; border: string; bg: string; label: string }> = {
  active: { text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-400/60 dark:border-emerald-500/50', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Live' },
  ended: { text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-400/60 dark:border-yellow-500/50', bg: 'bg-yellow-50 dark:bg-yellow-500/10', label: 'Ended' },
  scheduled: { text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-400/60 dark:border-indigo-500/50', bg: 'bg-indigo-50 dark:bg-indigo-500/10', label: 'Scheduled' },
  cancelled: { text: 'text-red-600 dark:text-red-400', border: 'border-red-400/60 dark:border-red-500/50', bg: 'bg-red-50 dark:bg-red-500/10', label: 'Cancelled' },
  canceled: { text: 'text-red-600 dark:text-red-400', border: 'border-red-400/60 dark:border-red-500/50', bg: 'bg-red-50 dark:bg-red-500/10', label: 'Cancelled' },
  unsold: { text: 'text-zinc-500 dark:text-zinc-400', border: 'border-zinc-400/60 dark:border-zinc-500/50', bg: 'bg-zinc-100 dark:bg-zinc-500/10', label: 'Unsold' },
};

const getStatusBadge = (status: string) => {
  const style = statusStyles[status.toLowerCase()] ?? {
    text: 'text-zinc-500 dark:text-zinc-400',
    border: 'border-zinc-300 dark:border-zinc-600',
    bg: 'bg-zinc-50 dark:bg-zinc-800/40',
    label: status,
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide h-6 ${style.bg} ${style.border} ${style.text}`}>
      {style.label}
    </span>
  );
};

const RecentAuctionsTable: React.FC<RecentAuctionsTableProps> = ({ auctions }) => {
  const downloadMutation = useDownloadFileMutation();

  const handleDownload = (id: string) => {
    downloadMutation.mutate({ id, category: 'bidding' });
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auctions.map((auction, index) => (
              <TableRow key={auction.id}>
                <TableCell className="font-medium text-muted-foreground text-xs">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <img
                    src={auction.imageKey}
                    alt={auction.title}
                    className="h-10 w-10 rounded-md bg-muted object-cover"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{auction.title}</span>
                    <div className="flex items-center gap-2">
                      {(auction as any).host ? (
                        <div className="flex items-center gap-1.5">
                          <div className="h-4 w-4 rounded-full overflow-hidden bg-zinc-200">
                            <img
                              src={
                                (auction as any).host.profileImage ||
                                `https://ui-avatars.com/api/?name=${(auction as any).host.name}&background=random`
                              }
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {(auction as any).host.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Unknown Host</span>
                      )}
                      {(auction as any).description && (
                        <>
                          <span className="text-xs text-muted-foreground/50">•</span>
                          <span
                            className="text-xs text-muted-foreground truncate max-w-[150px]"
                            title={(auction as any).description}
                          >
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
                    <span className="text-xs text-muted-foreground">
                      Start: {auction.startPrice} AC
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  <div className="flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {new Date(auction.endTime).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {getStatusBadge(auction.status)}
                </TableCell>
                <TableCell className="text-right">
                   {auction.status.toLowerCase() === 'ended' && (
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-emerald-500 transition-colors"
                        onClick={() => handleDownload(auction.id)}
                        disabled={downloadMutation.isPending && downloadMutation.variables?.id === auction.id}
                        title="Download Asset"
                     >
                        {downloadMutation.isPending && downloadMutation.variables?.id === auction.id ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                           <Download className="h-4 w-4" />
                        )}
                     </Button>
                   )}
                </TableCell>
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