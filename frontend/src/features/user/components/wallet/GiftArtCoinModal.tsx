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
    const balance = wallet.balance || 0;

    const giftMutation = useGiftArtCoinMutation();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAmount(val);
        if (Number(val) > balance) {
            setError("Insufficient balance");
        } else {
            setError("");
        }
    };

    const handleSendGift = async () => {
        const numAmount = Number(amount);
        if (!numAmount || numAmount <= 0) {
            setError("Please enter a valid amount");
            return;
        }
        if (numAmount > balance) {
            setError("Insufficient balance");
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Gift className="w-5 h-5 text-indigo-500" />
                        Send a Gift
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2 space-y-6">
                    {/* Receiver Info */}
                    <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                            {receiverImage ? (
                                <img src={receiverImage} alt={receiverName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-lg">
                                    {receiverName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-zinc-400">To</p>
                            <p className="font-semibold text-lg">{receiverName}</p>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-zinc-400">Amount (Art Coins)</Label>
                        <div className="relative">
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0"
                                value={amount}
                                onChange={handleAmountChange}
                                className="bg-zinc-900 border-zinc-700 pl-10 text-lg font-mono placeholder:text-zinc-600 focus:border-indigo-500"
                            />
                            <Coins className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                                Balance: {balance}
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                    </div>

                    {/* Message Input */}
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-zinc-400">Message (Optional)</Label>
                        <Textarea
                            id="message"
                            placeholder="Add a nice message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-zinc-900 border-zinc-700 resize-none h-24 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={giftMutation.isPending}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSendGift} 
                        disabled={giftMutation.isPending || !!error || !amount}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold"
                    >
                        {giftMutation.isPending ? <CustomLoader size={20} /> : "Send Gift"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
