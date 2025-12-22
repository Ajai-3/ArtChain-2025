// WithdrawalModal.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { withdrawalSchema, type WithdrawalFormData } from "../../schemas/withdrawalSchema";
import { useCreateWithdrawalRequest } from "../../hooks/wallet/useCreateWithdrawalRequest";
import CustomLoader from "../../../../components/CustomLoader";
import WithdrawalSuccessModal from "./WithdrawalSuccessModal";

interface WithdrawalModalProps {
  trigger: React.ReactNode;
  balance: number;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ trigger, balance }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState<"BANK_TRANSFER" | "UPI">("BANK_TRANSFER");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount: number;
    method: string;
    accountDetails: string;
  } | null>(null);
  
  const createWithdrawalMutation = useCreateWithdrawalRequest();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      method: "BANK_TRANSFER",
      amount: undefined,
    },
  });

  const amount = watch("amount");

  const resetState = () => {
    reset({
      method: "BANK_TRANSFER",
      amount: undefined,
      accountHolderName: undefined,
      accountNumber: undefined,
      ifscCode: undefined,
      upiId: undefined,
    });
    setMethod("BANK_TRANSFER");
  };

  const onSubmit = async (data: WithdrawalFormData) => {
    try {
      console.log("Submitting withdrawal request:", data);
      console.log("Form errors:", errors);
      await createWithdrawalMutation.mutateAsync(data);
      console.log("Withdrawal request successful");
      
      // Prepare success modal data
      const accountDetails = data.method === "BANK_TRANSFER" 
        ? `${data.accountHolderName} - ${data.accountNumber?.replace(/(\d{4})(?=\d)/g, "$1 ")}`
        : data.upiId || "";
      
      setSuccessData({
        amount: data.amount,
        method: data.method,
        accountDetails,
      });
      
      // Close withdrawal modal and show success modal
      setIsOpen(false);
      setShowSuccessModal(true);
      resetState();
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Withdrawal submission error:", error);
    }
  };

  const handleMethodChange = (newMethod: "BANK_TRANSFER" | "UPI") => {
    setMethod(newMethod);
    setValue("method", newMethod);
    // Clear the fields for the other method
    if (newMethod === "UPI") {
      setValue("accountHolderName", undefined);
      setValue("accountNumber", undefined);
      setValue("ifscCode", undefined);
    } else {
      setValue("upiId", undefined);
    }
  };

  const isLoading = isSubmitting || createWithdrawalMutation.isPending;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) resetState(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md w-full bg-background rounded-lg p-6 border border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Withdraw Funds</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
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
                    {...register("amount", { valueAsNumber: true })}
                    className="bg-background border-input text-foreground"
                />
                {errors.amount && (
                  <p className="text-xs text-destructive">{errors.amount.message}</p>
                )}
                <p className="text-xs text-muted-foreground text-right">Min: 100 AC | Max: 1,000,000 AC</p>
            </div>

             {/* Method Selection */}
             <div className="space-y-2">
                <Label className="text-foreground">Payout Method</Label>
                <input type="hidden" {...register("method")} />
                <div className="flex gap-2">
                    <Button 
                        type="button"
                        variant={method === 'BANK_TRANSFER' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => handleMethodChange('BANK_TRANSFER')}
                        className="flex-1"
                    >
                        Bank Transfer
                    </Button>
                    <Button 
                        type="button"
                        variant={method === 'UPI' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => handleMethodChange('UPI')}
                        className="flex-1"
                    >
                        UPI
                    </Button>
                </div>
             </div>

             {/* Dynamic Inputs based on Method */}
             {method === "BANK_TRANSFER" ? (
                 <div className="space-y-3 p-3 border border-border rounded-md bg-secondary/20">
                     <div className="space-y-1">
                         <Label htmlFor="accountHolderName" className="text-xs text-muted-foreground">Account Holder Name</Label>
                         <Input 
                            id="accountHolderName"
                            placeholder="e.g. John Doe"
                            {...register("accountHolderName")}
                            className="h-8 text-sm"
                         />
                         {errors.accountHolderName && (
                           <p className="text-xs text-destructive">{errors.accountHolderName.message}</p>
                         )}
                     </div>
                     <div className="space-y-1">
                         <Label htmlFor="accountNumber" className="text-xs text-muted-foreground">Account Number</Label>
                         <Input 
                            id="accountNumber"
                            placeholder="Enter Account No (9-18 digits)"
                            {...register("accountNumber")}
                            className="h-8 text-sm"
                         />
                         {errors.accountNumber && (
                           <p className="text-xs text-destructive">{errors.accountNumber.message}</p>
                         )}
                     </div>
                     <div className="space-y-1">
                         <Label htmlFor="ifscCode" className="text-xs text-muted-foreground">IFSC Code</Label>
                         <Input 
                            id="ifscCode"
                            placeholder="e.g. SBIN0001234"
                            {...register("ifscCode")}
                            className="h-8 text-sm"
                         />
                         {errors.ifscCode && (
                           <p className="text-xs text-destructive">{errors.ifscCode.message}</p>
                         )}
                     </div>
                 </div>
             ) : (
                <div className="space-y-1 p-3 border border-border rounded-md bg-secondary/20">
                     <Label htmlFor="upiId" className="text-xs text-muted-foreground">UPI ID</Label>
                     <Input 
                        id="upiId"
                        placeholder="username@paytm"
                        {...register("upiId")}
                        className="h-9 text-sm"
                     />
                     {errors.upiId && (
                       <p className="text-xs text-destructive">{errors.upiId.message}</p>
                     )}
                </div>
             )}

             {/* Action Button */}
             <Button 
                type="submit"
                className="w-full mt-2" 
                variant="main"
                disabled={isLoading || !amount || amount > balance}
             >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <CustomLoader size={16} />
                    Processing Request...
                  </span>
                ) : (
                  "Confirm Withdrawal"
                )}
             </Button>
        </form>
      </DialogContent>
    </Dialog>
    
    {/* Success Modal */}
    {successData && (
      <WithdrawalSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={successData.amount}
        method={successData.method}
        accountDetails={successData.accountDetails}
      />
    )}
    </>
  );
};

export default WithdrawalModal;
