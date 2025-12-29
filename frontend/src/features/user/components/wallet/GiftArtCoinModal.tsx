import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { useSelector } from 'react-redux';
import type { RootState } from "../../../../redux/store";
import { useGiftArtCoinMutation } from '../../hooks/wallet/useGiftArtCoinMutation';
import { Gift, Coins } from 'lucide-react';
import CustomLoader from '../../../../components/CustomLoader';

interface GiftArtCoinModalProps {
    isOpen: boolean;
    onClose: () => void;
    receiverId: string;
    receiverName: string;
    receiverImage?: string;
}

export const GiftArtCoinModal: React.FC<GiftArtCoinModalProps> = ({ 
    isOpen, 
    onClose, 
    receiverId, 
    receiverName,
    receiverImage
}) => {
    const [amount, setAmount] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    const wallet = useSelector((state: RootState) => state.wallet);
    const platform = useSelector((state: RootState) => state.platform);
    const balance = wallet.balance || 0;
    const artCoinRate = platform.artCoinRate || 10;

    const giftMutation = useGiftArtCoinMutation();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAmount(val);
        
        const numVal = parseFloat(val);
        if (isNaN(numVal)) {
            setError("");
            return;
        }

        if (numVal <= 0) {
            setError("Please enter a valid amount");
        } else if (numVal > balance) {
            setError("Insufficient balance");
        } else if (numVal > 10000) {
            setError("Maximum gift amount is 10,000 Art Coins");
        } else {
            setError("");
        }
    };

    const handleSendGift = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount");
            return;
        }
        if (numAmount > balance) {
            setError("Insufficient balance");
            return;
        }
        if (numAmount > 10000) {
            setError("Amount exceeds maximum limit of 10,000");
            return;
        }

        try {
            await giftMutation.mutateAsync({
                receiverId,
                amount: numAmount,
                message
            });
            onClose();
            setAmount("");
            setMessage("");
        } catch (e) {
            // Error handled in hook
        }
    };

    const realMoneyValue = (parseFloat(amount) || 0) * artCoinRate;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white overflow-hidden p-0 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <Gift className="w-6 h-6 text-indigo-400" />
                        Send a Gift
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 py-4 space-y-6">
                    {/* Receiver Info */}
                    <div className="flex items-center gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20 ring-2 ring-zinc-800 ring-offset-2 ring-offset-zinc-950">
                                {receiverImage ? (
                                    <img src={receiverImage} alt={receiverName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-xl uppercase">
                                        {receiverName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-indigo-500 p-1 rounded-full border-2 border-zinc-950">
                                <Gift className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Sending Gift To</p>
                            <p className="font-bold text-lg text-white truncate">{receiverName}</p>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <Label htmlFor="amount" className="text-zinc-400 text-sm font-medium">Gift Amount</Label>
                            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                                MAX: 10,000 AC
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                                    <Coins className="w-5 h-5 text-zinc-500" />
                                </div>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="any"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className="bg-zinc-900/60 border-zinc-800 h-14 pl-10 pr-24 text-xl font-bold font-mono text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl"
                                />
                                <div className="absolute inset-y-0 right-3 flex items-center text-sm font-bold text-zinc-500 pointer-events-none">
                                    ART COINS
                                </div>
                            </div>

                            {/* Live Conversion & Balance */}
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                    <p className="text-xs text-zinc-500 font-medium">Value:</p>
                                    <p className="text-sm font-bold text-emerald-400 truncate">
                                        ₹ {realMoneyValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-zinc-500 shrink-0">
                                    <Coins className="w-3 h-3" />
                                    <p className="text-[11px] font-bold">Balance: {balance.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                                <p className="text-red-400 text-xs font-medium">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Message Input */}
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-zinc-400 text-sm font-medium">Add a Note <span className="text-zinc-600 font-normal">(Optional)</span></Label>
                        <Textarea
                            id="message"
                            placeholder="Wanna say something nice?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-zinc-900/60 border-zinc-800 rounded-xl resize-none h-24 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-200 placeholder:text-zinc-700"
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 flex flex-col sm:flex-row gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={onClose} 
                        disabled={giftMutation.isPending}
                        className="flex-1 h-12 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSendGift} 
                        disabled={giftMutation.isPending || !!error || !amount}
                        className="flex-[2] h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none transition-all"
                    >
                        {giftMutation.isPending ? <CustomLoader size={20} /> : "Send Gift Now"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
