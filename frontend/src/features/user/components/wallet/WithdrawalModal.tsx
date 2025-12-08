// WithdrawalModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

interface WithdrawalModalProps {
  trigger: React.ReactNode;
  balance: number;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ trigger, balance }) => {
  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState<"bank" | "upi">("bank");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Separate states for better validation
  const [bankInfo, setBankInfo] = useState({ holder: "", account: "", ifsc: "" });
  const [upiId, setUpiId] = useState("");

  const resetState = () => {
    setAmount("");
    setBankInfo({ holder: "", account: "", ifsc: "" });
    setUpiId("");
    setIsLoading(false);
  };

  const handleWithdraw = () => {
    if (!amount || amount <= 0) return alert("Please enter a valid amount");
    if (amount > balance) return alert("Insufficient balance");
    
    if (method === 'bank') {
        if (!bankInfo.holder || !bankInfo.account || !bankInfo.ifsc) return alert("Please fill all bank details");
    } else {
        if (!upiId) return alert("Please enter UPI ID");
    }

    setIsLoading(true);

    // Dummy API call simulation
    setTimeout(() => {
        setIsLoading(false);
        alert(`Withdrawal of ${amount} AC requested successfully! This is a demo feature.`);
        setIsOpen(false);
        resetState();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) resetState(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md w-full bg-background rounded-lg p-6 border border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Withdraw Funds</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
            {/* Balance Display */}
            <div className="bg-secondary p-3 rounded-md border border-border flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Available Balance</span>
                <span className="font-bold text-lg text-foreground">{balance} AC</span>
            </div>

            {/* Amount Input */}
            <div className="space-y-1">
                <Label htmlFor="amount" className="text-foreground">Withdrawal Amount (AC)</Label>
                <Input 
                    id="amount" 
                    type="number" 
                    placeholder="Enter amount" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="bg-background border-input text-foreground"
                />
                <p className="text-xs text-muted-foreground text-right">Min: 100 AC</p>
            </div>

             {/* Method Selection */}
             <div className="space-y-2">
                <Label className="text-foreground">Payout Method</Label>
                <div className="flex gap-2">
                    <Button 
                        variant={method === 'bank' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setMethod('bank')}
                        className="flex-1"
                    >
                        Bank Transfer
                    </Button>
                    <Button 
                        variant={method === 'upi' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setMethod('upi')}
                        className="flex-1"
                    >
                        UPI
                    </Button>
                </div>
             </div>

             {/* Dynamic Inputs based on Method */}
             {method === "bank" ? (
                 <div className="space-y-3 p-3 border border-border rounded-md bg-secondary/20">
                     <div className="space-y-1">
                         <Label htmlFor="holder" className="text-xs text-muted-foreground">Account Holder Name</Label>
                         <Input 
                            id="holder"
                            placeholder="e.g. John Doe"
                            value={bankInfo.holder}
                            onChange={(e) => setBankInfo({...bankInfo, holder: e.target.value})}
                            className="h-8 text-sm"
                         />
                     </div>
                     <div className="space-y-1">
                         <Label htmlFor="account" className="text-xs text-muted-foreground">Account Number / IBAN</Label>
                         <Input 
                            id="account"
                            placeholder="Enter Account No"
                            value={bankInfo.account}
                            onChange={(e) => setBankInfo({...bankInfo, account: e.target.value})}
                            className="h-8 text-sm"
                         />
                     </div>
                     <div className="space-y-1">
                         <Label htmlFor="ifsc" className="text-xs text-muted-foreground">IFSC / SWIFT Code</Label>
                         <Input 
                            id="ifsc"
                            placeholder="Enter IFSC Code"
                            value={bankInfo.ifsc}
                            onChange={(e) => setBankInfo({...bankInfo, ifsc: e.target.value})}
                            className="h-8 text-sm"
                         />
                     </div>
                 </div>
             ) : (
                <div className="space-y-1 p-3 border border-border rounded-md bg-secondary/20">
                     <Label htmlFor="upi" className="text-xs text-muted-foreground">UPI ID</Label>
                     <Input 
                        id="upi"
                        placeholder="username@bank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="h-9 text-sm"
                     />
                </div>
             )}

             {/* Action Button */}
             <Button 
                onClick={handleWithdraw} 
                className="w-full mt-2" 
                variant="main" // Use 'main' variant per user request for theme consistency or custom variant
                disabled={isLoading || !amount || amount > balance}
             >
                {isLoading ? "Processing Request..." : "Confirm Withdrawal"}
             </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
