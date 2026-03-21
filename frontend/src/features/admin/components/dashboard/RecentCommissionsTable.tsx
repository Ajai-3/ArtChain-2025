import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import type { RecentCommission } from '../../hooks/dashboard/useDashboardStats';
import { Download, Loader2 } from 'lucide-react';
import { useDownloadFileMutation } from '../../../user/hooks/art/useDownloadFileMutation';
import { Button } from '../../../../components/ui/button';

interface RecentCommissionsTableProps {
  commissions: RecentCommission[];
}

const statusStyles: Record<string, { text: string; border: string; bg: string; label: string }> = {
  COMPLETED:   { text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-400/60 dark:border-emerald-500/50', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Completed' },
  IN_PROGRESS: { text: 'text-sky-600 dark:text-sky-400',         border: 'border-sky-400/60 dark:border-sky-500/50',         bg: 'bg-sky-50 dark:bg-sky-500/10',         label: 'In Progress' },
  AGREED:      { text: 'text-violet-600 dark:text-violet-400',   border: 'border-violet-400/60 dark:border-violet-500/50',   bg: 'bg-violet-50 dark:bg-violet-500/10',   label: 'Agreed' },
  REQUESTED:   { text: 'text-amber-600 dark:text-amber-400',     border: 'border-amber-400/60 dark:border-amber-500/50',     bg: 'bg-amber-50 dark:bg-amber-500/10',     label: 'Requested' },
  CANCELLED:   { text: 'text-red-600 dark:text-red-400',       border: 'border-red-400/60 dark:border-red-500/50',       bg: 'bg-red-50 dark:bg-red-500/10',       label: 'Cancelled' },
  NEGOTIATING: { text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-400/60 dark:border-orange-500/50', bg: 'bg-orange-50 dark:bg-orange-500/10', label: 'Negotiating' },
};

const getFallback = (status: string) => ({
  text: 'text-zinc-500 dark:text-zinc-400',
  border: 'border-zinc-300 dark:border-zinc-600',
  bg: 'bg-zinc-50 dark:bg-zinc-800/40',
  label: status.replace('_', ' '),
});

const RecentCommissionsTable: React.FC<RecentCommissionsTableProps> = ({ commissions }) => {
  const downloadMutation = useDownloadFileMutation();

  const handleDownload = (id: string) => {
    downloadMutation.mutate({ id, category: 'commission' });
  };
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
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((comm, index) => {
              const style = statusStyles[comm.status.toUpperCase()] ?? getFallback(comm.status);
              return (
                <TableRow key={comm.id}>
                  <TableCell className="font-medium text-muted-foreground text-xs">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 py-1">
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

                      {/* Client */}
                      <div className="pl-8 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <div className="h-6 w-6 rounded-full overflow-hidden bg-zinc-200 flex-shrink-0">
                            <img src={(comm as any).clientProfileImage || `https://ui-avatars.com/api/?name=${comm.clientName}&background=random`} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-muted-foreground">Client:</span>
                            <span className="text-xs font-medium">{comm.clientName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-emerald-500 font-bold text-sm">{comm.amount > 0 ? `${comm.amount} AC` : '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide h-6 ${style.bg} ${style.border} ${style.text}`}>
                      {style.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(comm.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right">
                     {comm.status.toUpperCase() === 'COMPLETED' && (
                       <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-emerald-500 transition-colors"
                          onClick={() => handleDownload(comm.id)}
                          disabled={downloadMutation.isPending && downloadMutation.variables?.id === comm.id}
                          title="Download Final Artwork"
                       >
                          {downloadMutation.isPending && downloadMutation.variables?.id === comm.id ? (
                             <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                             <Download className="h-4 w-4" />
                          )}
                       </Button>
                     )}
                  </TableCell>
                </TableRow>
              );
            })}
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