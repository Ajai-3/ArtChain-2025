import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { 
  AlertCircle
} from "lucide-react";
import { format } from 'date-fns';
import CustomLoader from '../../../../components/CustomLoader';
import { useCommissionsQuery } from '../../hooks/commissionManagement/useCommissionsQuery';
import { useResolveDisputeMutation } from '../../hooks/commissionManagement/useResolveDisputeMutation'; 
import CommissionDetailModal from './CommissionDetailModal';

interface CommissionTableProps {
  statusFilter: string;
}

const CommissionTable: React.FC<CommissionTableProps> = ({ statusFilter }) => {
  const [page, setPage] = useState(1);
  const [selectedCommission, setSelectedCommission] = useState<any>(null);
  
  // Only pass filter if it's not ALL
  const apiFilter = statusFilter === 'ALL' ? '' : statusFilter;
  
  const { data, isLoading } = useCommissionsQuery(page, 10, apiFilter);
  const resolveMutation = useResolveDisputeMutation();

  const handleResolve = (id: string, resolution: 'REFUND' | 'RELEASE') => {
    if (confirm(`Are you sure you want to ${resolution.toLowerCase()} this commission?`)) {
      resolveMutation.mutate({ id, resolution });
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><CustomLoader /></div>;

  const commissions = data?.commissions || [];
  const totalPages = data?.totalPages || 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20';
      case 'DISPUTE_RAISED': return 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20';
      case 'LOCKED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20';
      case 'IN_PROGRESS': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20';
      case 'CANCELLED': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
      case 'REQUESTED': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20';
      case 'NEGOTIATING': return 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20';
      case 'AGREED': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20';
      case 'DELIVERED': return 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-zinc-900">
              <TableHead className="px-4 py-2 text-left w-[50px] font-medium text-zinc-500">No</TableHead>
              <TableHead className="px-4 py-2 text-left">Commission</TableHead>
              <TableHead className="px-4 py-2 text-left">Participants</TableHead>
              <TableHead className="px-4 py-2 text-left">Budget</TableHead>
              <TableHead className="px-4 py-2 text-left">Status</TableHead>
              <TableHead className="px-4 py-2 text-left">Requested At</TableHead>
              <TableHead className="px-4 py-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-zinc-500">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-zinc-600 mb-2" />
                    <p>No commissions found</p>
                    {statusFilter !== 'ALL' && <p className="text-xs">Try changing the filter</p>}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              commissions.map((c: any, index: number) => (
                <TableRow key={c.id} className="hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                  <TableCell className="px-4 py-2 font-mono text-zinc-500">
                    {(page - 1) * 10 + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium truncate max-w-[250px]" title={c.title}>{c.title}</span>
                      <span className="text-sm text-zinc-500 truncate max-w-[250px]">{c.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex flex-col gap-3">
                       {/* Requester Info */}
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700">
                            {c.requester?.profileImage ? (
                               <img src={c.requester.profileImage} alt={c.requester.username} className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">?</div>
                            )}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Requester</span>
                             <span className="text-sm font-medium" title={c.requesterId}>
                                {c.requester?.username || 'Unknown'}
                             </span>
                          </div>
                       </div>
                       
                       {/* Artist Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border border-indigo-500/30">
                            {c.artist?.profileImage ? (
                               <img src={c.artist.profileImage} alt={c.artist.username} className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center text-xs text-indigo-500">?</div>
                            )}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] text-indigo-500 uppercase tracking-wider font-semibold">Artist</span>
                             <span className="text-sm font-medium text-indigo-400" title={c.artistId}>
                                {c.artist?.username || 'Unknown'}
                             </span>
                          </div>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-500">
                      <span>{c.budget}</span>
                      <span className="text-xs text-emerald-600/70">AC</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(c.status)}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-zinc-500">
                    <div className="flex flex-col">
                      <span className="text-sm">{format(new Date(c.createdAt), 'MMM dd, yyyy')}</span>
                      <span className="text-xs text-zinc-600">{format(new Date(c.createdAt), 'hh:mm a')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    <div className="flex justify-end items-center gap-2">
                        {c.status === 'DISPUTE_RAISED' && (
                           <Button 
                              size="sm" 
                              variant="destructive"
                              className="h-8 text-xs"
                              onClick={() => setSelectedCommission(c)}
                           >
                              Resolve
                           </Button>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-3"
                            onClick={() => setSelectedCommission(c)}
                        >
                          View
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
             <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
            >
                Previous
            </Button>
             <span className="text-sm text-zinc-500 px-2">
                Page {page} of {totalPages}
             </span>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
            >
                Next
            </Button>
        </div>
      )}

      {/* Detail Modal */}
      <CommissionDetailModal 
         isOpen={!!selectedCommission}
         onClose={() => setSelectedCommission(null)}
         commission={selectedCommission}
         onResolveDispute={handleResolve}
         isResolving={resolveMutation.isPending}
      />
    </div>
  );
};

export default CommissionTable;
