import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../../components/ui/dialog";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { ExternalLink, Coins, User, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface CommissionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    commission: any;
    onResolveDispute?: (id: string, resolution: 'REFUND' | 'RELEASE') => void;
    isResolving?: boolean;
}

const CommissionDetailModal: React.FC<CommissionDetailModalProps> = ({ 
    isOpen, 
    onClose, 
    commission,
    onResolveDispute,
    isResolving
}) => {
    if (!commission) return null;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'default'; // Using default for completed often maps to primary color or check styles
            case 'DISPUTE_RAISED': return 'destructive';
            case 'LOCKED': return 'secondary';
            case 'IN_PROGRESS': return 'default'; // Consider a custom variant if available
            default: return 'outline';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 bg-zinc-900/50 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <DialogTitle className="text-xl font-bold">{commission.title}</DialogTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant={getStatusVariant(commission.status)} className="capitalize">
                                    {commission.status.replace('_', ' ').toLowerCase()}
                                </Badge>
                                <span className="text-xs text-zinc-500 font-mono">ID: {commission.id}</span>
                            </div>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-2xl font-bold flex items-center gap-1 text-emerald-400">
                                {commission.budget} <Coins className="w-5 h-5 fill-emerald-400/20" />
                            </span>
                            <span className="text-xs text-zinc-500">Total Budget</span>
                         </div>
                    </div>
                </DialogHeader>
                
                <div className="max-h-[60vh] overflow-y-auto p-6 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Details */}
                        <div className="space-y-6">
                            
                            {/* Description */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Description</h4>
                                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                                    {commission.description}
                                </p>
                            </div>

                            {/* Reference Images */}
                            {commission.referenceImages && commission.referenceImages.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Reference Images</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {commission.referenceImages.map((img: string, index: number) => (
                                            <div 
                                                key={index}
                                                className="aspect-square rounded-md overflow-hidden border border-zinc-800 relative group cursor-pointer"
                                                onClick={() => window.open(img, '_blank')}
                                            >
                                                <img src={img} alt={`Reference ${index + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <ExternalLink className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Timeline */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Timeline
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/50">
                                        <span className="text-xs text-zinc-500 block mb-1">Created At</span>
                                        <span className="text-sm font-mono text-zinc-300">
                                            {format(new Date(commission.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                    <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/50">
                                        <span className="text-xs text-zinc-500 block mb-1">Deadline</span>
                                        <span className="text-sm font-mono text-zinc-300">
                                            {format(new Date(commission.deadline), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Participants & Dispute */}
                        <div className="space-y-6">
                             {/* Participants */}
                             <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2">
                                    <User className="w-4 h-4" /> Participants
                                </h4>
                                
                                {/* Requester Card */}
                                <div className="flex items-center gap-3 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/50">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
                                        {commission.requester?.profileImage ? (
                                            <img src={commission.requester.profileImage} alt={commission.requester.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">?</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs text-zinc-500 uppercase tracking-wider block">Requester</span>
                                        <p className="font-semibold text-sm truncate text-zinc-200">
                                            {commission.requester?.username || commission.requesterId}
                                        </p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={() => window.open(`/${commission.requester?.username || ''}`, '_blank')}
                                    >
                                        <ExternalLink className="w-4 h-4 text-zinc-500" />
                                    </Button>
                                </div>

                                {/* Artist Card */}
                                <div className="flex items-center gap-3 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/20">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border border-indigo-500/30">
                                        {commission.artist?.profileImage ? (
                                            <img src={commission.artist.profileImage} alt={commission.artist.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-indigo-500 text-xs">?</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs text-indigo-400/70 uppercase tracking-wider block">Artist</span>
                                        <p className="font-semibold text-sm truncate text-indigo-300">
                                            {commission.artist?.username || commission.artistId}
                                        </p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 hover:bg-indigo-500/10"
                                        onClick={() => window.open(`/${commission.artist?.username || ''}`, '_blank')}
                                    >
                                        <ExternalLink className="w-4 h-4 text-indigo-400" />
                                    </Button>
                                </div>
                             </div>

                             {/* Dispute Section (if applicable) */}
                             {commission.status === 'DISPUTE_RAISED' && (
                                 <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-3">
                                     <h5 className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                                         <AlertTriangle className="w-4 h-4" /> Dispute Active
                                     </h5>
                                     <p className="text-sm text-zinc-300 italic">
                                         "{commission.disputeReason || "No reason provided."}"
                                     </p>
                                     <div className="pt-2 flex gap-2 w-full">
                                         <Button 
                                            variant="outline" 
                                            className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                            onClick={() => onResolveDispute?.(commission.id, 'REFUND')}
                                            disabled={isResolving}
                                         >
                                             Refund Requester
                                         </Button>
                                         <Button 
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={() => onResolveDispute?.(commission.id, 'RELEASE')}
                                            disabled={isResolving}
                                         >
                                             Release to Artist
                                         </Button>
                                     </div>
                                 </div>
                             )}

                             {/* Final Artwork (if delivered) */}
                             {commission.finalArtwork && (
                                 <div className="space-y-2">
                                     <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Final Artwork</h4>
                                      <div className="rounded-lg overflow-hidden border border-zinc-800 relative group aspect-video bg-zinc-900">
                                          <img src={commission.finalArtwork} alt="Final Delivery" className="w-full h-full object-cover" />
                                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                              <Button variant="secondary" size="sm" onClick={() => window.open(commission.finalArtwork, '_blank')}>
                                                  View Full Size
                                              </Button>
                                          </div>
                                      </div>
                                 </div>
                             )}

                             {/* Activity History */}
                             {commission.history && commission.history.length > 0 && (
                                <div className="space-y-3 pt-2 border-t border-zinc-900">
                                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> History
                                    </h4>
                                    <div className="space-y-3 pl-1">
                                        {[...commission.history].reverse().map((event: any, i: number) => (
                                            <div key={i} className="relative pl-4 border-l border-zinc-800">
                                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-medium text-zinc-300">
                                                        {event.action.replace(/_/g, ' ')}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-500">
                                                        {format(new Date(event.timestamp), 'MMM dd, hh:mm a')}
                                                    </span>
                                                    {event.details && (
                                                        <span className="text-[11px] text-zinc-400 italic">
                                                            {event.details}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
                <DialogFooter className="p-4 bg-zinc-900/50 border-t border-zinc-800">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CommissionDetailModal;
