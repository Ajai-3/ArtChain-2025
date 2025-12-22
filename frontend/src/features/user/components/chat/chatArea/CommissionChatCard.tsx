import React, { useState } from "react";
import { format } from "date-fns";
import { 
  DollarSign, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  ExternalLink,
  History,
  Plus,
  X
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { useGetCommissionByConversation } from "../../../hooks/commission/useGetCommissionByConversation";

import { CommissionEditModal } from "./CommissionEditModal";
import { useUpdateCommissionMutation } from "../../../hooks/commission/useUpdateCommissionMutation";
import { useLockCommissionMutation } from "../../../hooks/commission/useLockCommissionMutation";
import { cn } from "../../../../../libs/utils";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../../components/ui/dialog";
import { Textarea } from "../../../../../components/ui/textarea";
import { useUploadArtImageMutation } from "../../../hooks/art/useUploadArtImageMutation";
import CustomLoader from "../../../../../components/CustomLoader";

interface CommissionChatCardProps {
  conversationId: string;
  currentUserId: string;
}

export const CommissionChatCard: React.FC<CommissionChatCardProps> = ({
  conversationId,
  currentUserId,
}) => {
  const { data: res, isLoading } = useGetCommissionByConversation(conversationId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const updateMutation = useUpdateCommissionMutation();
  const lockMutation = useLockCommissionMutation();

  const commission = res?.active;
  const history = res?.history || [];

  const handleStatusUpdate = (status: string, extraData: any = {}) => {
    if (!commission) return;
    updateMutation.mutate({
      id: commission.id,
      data: { status, ...extraData }
    });
  };

  const handlePayment = () => {
    if (!commission) return;
    lockMutation.mutate({
      userId: currentUserId,
      commissionId: commission.id,
      amount: commission.budget
    }, {
      onSuccess: () => {
        // After funds are locked, update commission status to LOCKED
        handleStatusUpdate("LOCKED");
      }
    });
  };

  const handleDelivery = (imageUrl: string) => {
    handleStatusUpdate("DELIVERED", { finalArtwork: imageUrl });
    setIsDeliverModalOpen(false);
  };

  const handleRaiseDispute = () => {
    if (!disputeReason.trim()) return toast.error("Please provide a reason");
    handleStatusUpdate("DISPUTE_RAISED", { disputeReason });
    setIsDisputeModalOpen(false);
    setDisputeReason("");
  };

  if (isLoading || !commission) return null;

  const isRequester = commission.requesterId === currentUserId;
  const isArtist = commission.artistId === currentUserId;
  const isNegotiating = commission.status === "REQUESTED" || commission.status === "NEGOTIATING";
  const isCompletedOrCancelled = commission.status === "COMPLETED" || commission.status === "CANCELLED";

  // Accept button visible if status is initial AND current user is NOT the one who made the last change
  const canAccept = isNegotiating && commission.lastUpdatedBy !== currentUserId;
  const canEdit = isNegotiating;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REQUESTED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "NEGOTIATING": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "AGREED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "LOCKED": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "IN_PROGRESS": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "COMPLETED": return "bg-green-600/10 text-green-600 border-green-600/20";
      case "CANCELLED": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const isPastDeadline = new Date() > new Date(commission.deadline);
  const canRaiseDispute = isRequester && (
      commission.status === "DELIVERED" || 
      ((commission.status === "IN_PROGRESS" || commission.status === "LOCKED") && isPastDeadline)
  );

  return (
    <div className="mx-4 mt-2 mb-1">
      {/* ... keeping wrapper ... */}
      <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Compact Header */}
        <div className="p-3 flex items-center justify-between">
            {/* ... left part ... */}
          <div className="flex items-center gap-3">
             {/* ... */}
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <span className="text-xl">🎨</span>
            </div>
            <div>
              <h4 className="font-semibold text-white leading-tight">
                {commission.title}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="outline" className={cn("text-[10px] px-1.5 h-4", getStatusColor(commission.status))}>
                  {commission.status}
                </Badge>
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {commission.budget} Art Coins
                  {isArtist && commission.platformFeePercentage && (
                    <span className="text-[10px] text-zinc-500 ml-1">
                      (Net: {(commission.budget * (1 - commission.platformFeePercentage / 100)).toFixed(0)} después de %{commission.platformFeePercentage} fee)
                    </span>
                  )}
                </span>
                {isPastDeadline && commission.status !== 'COMPLETED' && commission.status !== 'CANCELLED' && (
                    <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Past Deadline
                    </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canAccept && (
               <div className="flex items-center gap-1.5 mr-2 pr-2 border-r border-zinc-800">
                  <button 
                    onClick={() => handleStatusUpdate("CANCELLED")}
                    disabled={updateMutation.isPending}
                    className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-500 px-2.5 py-1 rounded-md font-medium transition-colors border border-red-500/20"
                  >
                    Decline
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate("AGREED")}
                    disabled={updateMutation.isPending}
                    className="text-[10px] bg-emerald-500 hover:bg-emerald-600 text-black px-2.5 py-1 rounded-md font-bold transition-colors"
                  >
                    Accept Terms
                  </button>
               </div>
            )}

            {(commission.status === "LOCKED" || commission.status === "IN_PROGRESS") && isArtist && (
               <Button 
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-black font-bold h-7 text-[10px] px-3 mr-2"
                onClick={() => setIsDeliverModalOpen(true)}
               >
                 Deliver Artwork
               </Button>
            )}

            <div className="flex items-center gap-1.5 mr-2">
                {canRaiseDispute && (
                    <Button 
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-500/10 h-7 text-[10px]"
                        onClick={() => setIsDisputeModalOpen(true)}
                    >
                    Raise Dispute
                    </Button>
                )}
                {commission.status === "DELIVERED" && isRequester && (
                    <Button 
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-7 text-[10px]"
                        onClick={() => handleStatusUpdate("COMPLETED")}
                        disabled={updateMutation.isPending}
                    >
                    Approve & Complete
                    </Button>
                )}
            </div>

            {canEdit && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 transition-colors", showHistory ? "text-green-500 bg-green-500/10" : "text-zinc-400 hover:text-white")}
                onClick={() => {
                  setShowHistory(!showHistory);
                  if (!showHistory) setIsExpanded(true);
                }}
                title="View Commission History"
              >
                <History className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={() => {
                setIsExpanded(!isExpanded);
                if (isExpanded) setShowHistory(false);
              }}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 pb-4 pt-1 border-t border-zinc-800 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Description</label>
                  <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
                    {commission.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Deadline
                    </label>
                    <p className="text-xs text-white mt-0.5">
                      {format(new Date(commission.deadline), "PPP")}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Reference Images</label>
                {commission.referenceImages && commission.referenceImages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {commission.referenceImages.map((img: string, idx: number) => (
                      <a 
                        key={idx} 
                        href={img} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-16 h-16 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-zinc-500 transition-colors relative group"
                      >
                        <img src={img} alt="ref" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">No reference images provided</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-zinc-800/50 flex justify-between items-center">
                <div className="flex gap-2">
                  {showHistory && history.map((prev: any, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-[9px] opacity-60">
                      {prev.title} ({prev.status})
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                    {isCompletedOrCancelled && isRequester && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-white hover:bg-green-500/10 hover:text-green-500 border border-zinc-700 h-8 gap-1"
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        <Plus className="w-3 h-3" /> Request New
                      </Button>
                    )}
                    {commission.status === "AGREED" && isRequester && (
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8"
                        onClick={handlePayment}
                        disabled={lockMutation.isPending}
                      >
                        {lockMutation.isPending ? "Processing..." : "Pay & Start Commission"}
                      </Button>
                    )}
                    {commission.status === "AGREED" && isArtist && (
                      <span className="text-xs text-zinc-400 italic py-1">Waiting for payment from requester...</span>
                    )}
                    {commission.lastUpdatedBy === currentUserId && isNegotiating && (
                       <span className="text-xs text-zinc-400 italic py-1">Waiting for {isRequester ? "Artist" : "Client"} to respond...</span>
                    )}
                </div>
            </div>

            {showHistory && (
              <div className="mt-4 pt-4 border-t border-zinc-800 animate-in fade-in duration-300">
                <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <History className="w-3 h-3" /> Previous Commissions
                </h5>
                <div className="space-y-2">
                  {history.map((prev: any, idx: number) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-2.5 flex items-center justify-between border border-transparent hover:border-zinc-700 transition-colors">
                      <div>
                        <p className="text-xs font-medium text-white">{prev.title}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{format(new Date(prev.createdAt), "MMM d, yyyy")}</p>
                      </div>
                      <Badge variant="outline" className={cn("text-[9px] h-4", getStatusColor(prev.status))}>
                        {prev.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <CommissionEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        commission={commission} 
        isRequester={isRequester}
      />

      <DeliverArtworkModal 
        isOpen={isDeliverModalOpen}
        onClose={() => setIsDeliverModalOpen(false)}
        onDeliver={handleDelivery}
      />

      <Dialog open={isDisputeModalOpen} onOpenChange={setIsDisputeModalOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Raise a Dispute</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-zinc-400">
              Please describe why you are dissatisfied with the delivery. Admin will review this request.
            </p>
            <Textarea 
              placeholder="Reason for dispute..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="bg-zinc-900 border-zinc-700 focus:border-red-500 min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDisputeModalOpen(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleRaiseDispute} disabled={updateMutation.isPending}>
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DeliverArtworkModal = ({ isOpen, onClose, onDeliver }: { isOpen: boolean; onClose: () => void; onDeliver: (url: string) => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const uploadMutation = useUploadArtImageMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        try {
            const response = await uploadMutation.mutateAsync(file);
            const url = response?.data?.data || response?.data?.url;
            if (url) {
                onDeliver(url);
                setFile(null);
                setPreview(null);
            }
        } catch (error) {
            toast.error("Upload failed");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Deliver Final Artwork</DialogTitle>
                </DialogHeader>
                <div className="py-6 flex flex-col items-center gap-4">
                   {!preview ? (
                     <label className="w-full aspect-video border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-500/50 hover:bg-green-500/5 transition-all">
                        <Plus className="w-8 h-8 text-zinc-500 mb-2" />
                        <span className="text-sm text-zinc-500">Click to select final artwork file</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                     </label>
                   ) : (
                     <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={() => { setFile(null); setPreview(null); }}
                            className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full hover:bg-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                     </div>
                   )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={uploadMutation.isPending}>Cancel</Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleUpload} disabled={!file || uploadMutation.isPending}>
                        {uploadMutation.isPending ? <CustomLoader /> : "Upload & Deliver"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

