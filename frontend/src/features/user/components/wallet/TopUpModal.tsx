// TopUpModal.tsx
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

import { loadStripe } from "@stripe/stripe-js";

import { useCreateStripeSession } from "../../hooks/wallet/useCreateStripeSession";
import { useCreateRazorpayOrder } from "../../hooks/wallet/useCreateRazorpayOrder";

interface TopUpModalProps {
  trigger: React.ReactNode;
}

const stripePromise = loadStripe(
  "pk_test_51SA9ySIO0a4vdKba2B5FwDZ8CzklCTm2XDoQXa9WPzfjBilGeQblUbjUduMJSs4obDhuEUtDDhMM3EUAYret22kF00TVFIwzsh"
);

const TopUpModal: React.FC<TopUpModalProps> = ({ trigger }) => {
  const [amount, setAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "razorpay" | null
  >(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const stripeMutation = useCreateStripeSession();
  const razorpayMutation = useCreateRazorpayOrder();

  // Validation constants
  const MIN_ARTCOIN = 1;
  const MAX_ARTCOIN = 10000;
  const PRESET_AMOUNTS = [
    { ac: 100, inr: 1000 },
    { ac: 500, inr: 5000 },
    { ac: 3000, inr: 30000 },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input
    if (value === "") {
      setAmount("");
      return;
    }
    
    // Only allow positive numbers
    const numValue = Number(value);
    
    // Check if it's a valid positive number
    if (!isNaN(numValue) && numValue >= 0) {
      // Apply limits
      if (numValue > MAX_ARTCOIN) {
        setAmount(MAX_ARTCOIN);
      } else {
        setAmount(numValue);
      }
    }
    // If invalid (negative, decimal, or non-numeric), don't update state
  };

  const handlePresetAmount = (presetAmount: number) => {
    setAmount(presetAmount);
  };

  const resetState = () => {
    setAmount("");
    setPaymentMethod(null);
    setShowCheckout(false);
  };

  const isValidAmount = () => {
    if (amount === "") return false;
    const numAmount = Number(amount);
    return numAmount >= MIN_ARTCOIN && numAmount <= MAX_ARTCOIN;
  };

  const getErrorMessage = () => {
    if (amount === "") return "";
    
    const numAmount = Number(amount);
    if (numAmount < MIN_ARTCOIN) {
      return `Minimum ArtCoin amount is ${MIN_ARTCOIN}`;
    }
    if (numAmount > MAX_ARTCOIN) {
      return `Maximum ArtCoin amount is ${MAX_ARTCOIN}`;
    }
    return "";
  };

  const handleStripeCheckout = async () => {
    if (!isValidAmount()) return;
    try {
      const amountInINR = Number(amount) * 10;
      const { sessionId } = await stripeMutation.mutateAsync({
        amount: amountInINR,
      });
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err);
      alert("Stripe checkout failed. Try again.");
    }
  };

  const handleRazorpayCheckout = async () => {
    if (!isValidAmount()) return;
    try {
      const {
        orderId,
        amount: orderAmount,
        currency,
      } = await razorpayMutation.mutateAsync({ amount: Number(amount) });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency,
        name: "ArtCoin Topup",
        description: "Add ArtCoin balance",
        order_id: orderId,
        handler: (response: any) => {
          console.log("Razorpay success:", response);
          alert("✅ Razorpay Payment Successful!");
          resetState();
        },
        prefill: {
          email: "test@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      alert("Razorpay payment failed.");
    }
  };

  const isStripeLoading = stripeMutation.status === "pending";
  const isRazorpayLoading = razorpayMutation.status === "pending";
  const errorMessage = getErrorMessage();
  const hasError = !!errorMessage;

  return (
    <Dialog onOpenChange={(open) => !open && resetState()}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md w-full bg-background rounded-lg p-8">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Top Up ArtCoin
          </DialogTitle>
        </DialogHeader>

        {!showCheckout ? (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">
              How much would you like to add? (1 AC = 10 INR)
            </p>
            <div className="flex gap-2 mb-4">
              {PRESET_AMOUNTS.map((amt) => (
                <Button
                  key={amt.ac}
                  variant="outline"
                  className={`flex-1 flex flex-col items-center justify-center !py-6 gap-1 ${
                    amount === amt.ac ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => handlePresetAmount(amt.ac)}
                >
                  <span className="font-semibold">{amt.ac} AC</span>
                  <span className="text-xs text-gray-400">₹{amt.inr}</span>
                </Button>
              ))}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Amount (ArtCoin)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={handleChange}
                className={`mb-1 ${hasError ? "border-red-500" : ""}`}
                placeholder="0"
                min={MIN_ARTCOIN}
                max={MAX_ARTCOIN}
                onKeyDown={(e) => {
                  // Prevent negative sign, decimal point, and 'e' for scientific notation
                  if (['-', '.', 'e', 'E'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <div className="flex justify-between">
                <p className="text-xs text-gray-400">
                  ≈ ₹{amount ? Number(amount) * 10 : 0} INR
                </p>
                <p className="text-xs text-gray-400">
                  Limit: {MIN_ARTCOIN} - {MAX_ARTCOIN} AC
                </p>
              </div>
              {hasError && (
                <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
              )}
            </div>

            <p className="text-xs text-green-400 mb-4">
              Your ArtCoin will be available immediately after payment confirmation
            </p>

            <p className="text-sm font-medium mb-2">Payment Method</p>
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                className={`flex-1 items-center justify-center gap-1 border-2 ${
                  paymentMethod === "stripe"
                    ? "border-purple-600 text-purple-700"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("stripe")}
              >
                <span className="text-xs px-1 rounded-md bg-purple-600 text-white">
                  Stripe
                </span>
                <span className="font-medium">Stripe</span>
              </Button>

              <Button
                variant="outline"
                className={`flex-1 items-center justify-center gap-1 border-2 ${
                  paymentMethod === "razorpay"
                    ? "border-blue-600 text-blue-700"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("razorpay")}
              >
                <span className="text-xs px-1 rounded-md bg-blue-600 text-white">
                  Razorpay
                </span>
                <span className="font-medium">Razorpay</span>
              </Button>
            </div>

            <Button
              variant="main"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!isValidAmount() || !paymentMethod}
              onClick={() => setShowCheckout(true)}
            >
              Complete Payment
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            {paymentMethod === "stripe" && (
              <Button
                className="w-full text-white font-medium bg-purple-600 hover:bg-purple-700"
                onClick={handleStripeCheckout}
                disabled={isStripeLoading || !isValidAmount()}
              >
                {isStripeLoading
                  ? "Processing..."
                  : `Pay with Stripe ₹${Number(amount) * 10}`}
              </Button>
            )}
            {paymentMethod === "razorpay" && (
              <Button
                className="w-full text-white font-medium !bg-blue-600 hover:bg-blue-700"
                onClick={handleRazorpayCheckout}
                disabled={isRazorpayLoading || !isValidAmount()}
              >
                {isRazorpayLoading
                  ? "Processing..."
                  : `Pay with Razorpay ₹${Number(amount) * 10}`}
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => setShowCheckout(false)}
            >
              Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TopUpModal;