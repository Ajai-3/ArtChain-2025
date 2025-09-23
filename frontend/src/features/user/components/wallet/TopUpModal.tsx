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
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "razorpay" | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const stripeMutation = useCreateStripeSession();
  const razorpayMutation = useCreateRazorpayOrder();

  const resetState = () => {
    setAmount("");
    setPaymentMethod(null);
    setShowCheckout(false);
  };

  const handleStripeCheckout = async () => {
    if (!amount) return;
    try {
      const { sessionId } = await stripeMutation.mutateAsync({ amount });
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err);
      alert("Stripe checkout failed. Try again.");
    }
  };

  const handleRazorpayCheckout = async () => {
    if (!amount) return;
    try {
      const { orderId, amount: orderAmount, currency } = await razorpayMutation.mutateAsync({ amount });

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

  const presetAmounts = [
    { ac: 100, inr: 1000 },
    { ac: 500, inr: 5000 },
    { ac: 3000, inr: 30000 },
  ];

  const isStripeLoading = stripeMutation.status === "pending";
  const isRazorpayLoading = razorpayMutation.status === "pending";

  return (
    <Dialog onOpenChange={(open) => !open && resetState()}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md w-full bg-background rounded-lg p-8">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Top Up ArtCoin</DialogTitle>
        </DialogHeader>

        {!showCheckout ? (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">How much would you like to add?</p>
            <div className="flex gap-2 mb-4">
              {presetAmounts.map((amt) => (
                <Button
                  key={amt.ac}
                  variant="outline"
                  className="flex-1 flex flex-col items-center justify-center !py-6 gap-1"
                  onClick={() => setAmount(amt.ac)}
                >
                  <span className="font-semibold">{amt.ac} AC</span>
                  <span className="text-xs text-gray-400">₹{amt.inr}</span>
                </Button>
              ))}
            </div>

            <label className="block text-sm font-medium mb-1">Amount (ArtCoin)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mb-1"
              placeholder="0"
            />
            <p className="text-xs text-gray-400 mb-3">≈ ₹{amount ? amount * 10 : 0} INR</p>
            <p className="text-xs text-green-400 mb-4">
              Your ArtCoin will be available immediately after payment confirmation
            </p>

            <p className="text-sm font-medium mb-2">Payment Method</p>
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                className={`flex-1 items-center justify-center gap-1 border-2 ${
                  paymentMethod === "stripe" ? "border-purple-600 text-purple-700" : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("stripe")}
              >
                <span className="text-xs px-1 rounded-md bg-purple-600 text-white">Stripe</span>
                <span className="font-medium">Stripe</span>
              </Button>

              <Button
                variant="outline"
                className={`flex-1 items-center justify-center gap-1 border-2 ${
                  paymentMethod === "razorpay" ? "border-blue-600 text-blue-700" : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("razorpay")}
              >
                <span className="text-xs px-1 rounded-md bg-blue-600 text-white">Razorpay</span>
                <span className="font-medium">Razorpay</span>
              </Button>
            </div>

            <Button
              variant="main"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!amount || !paymentMethod}
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
                disabled={isStripeLoading}
              >
                {isStripeLoading ? "Processing..." : "Pay with Stripe ₹" + Number(amount) * 10}
              </Button>
            )}
            {paymentMethod === "razorpay" && (
              <Button
                className="w-full text-white font-medium !bg-blue-600 hover:bg-blue-700"
                onClick={handleRazorpayCheckout}
                disabled={isRazorpayLoading}
              >
                {isRazorpayLoading ? "Processing..." : "Pay with Razorpay ₹" + Number(amount) * 10}
              </Button>
            )}
            <Button variant="outline" className="w-full mt-2" onClick={() => setShowCheckout(false)}>
              Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TopUpModal;
