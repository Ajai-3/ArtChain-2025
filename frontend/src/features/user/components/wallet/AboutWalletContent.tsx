import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { ShieldCheck, Globe, Zap, Coins, ArrowRightLeft, Lock } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

const AboutWalletContent: React.FC = () => {
  const { artCoinRate, auctionCommissionPercentage, artSaleCommissionPercentage, commissionArtPercentage } = useSelector((state: RootState) => state.platform);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="dark:bg-secondary-color border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
               <Coins className="text-main-color" />
               About ArtChain Wallet
            </CardTitle>
            <CardDescription>
               Your secure gateway to the ArtChain economy. Manage your ArtCoins, track earnings, and withdraw funds seamlessly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              The ArtChain Wallet is designed to provide a transparent and efficient way to manage your digital assets. 
              Built on our proprietary ArtCoin (AC) standard, it ensures instant transactions and reduced fees for all platform activities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
               <div className="flex gap-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <Globe className="text-blue-400 w-6 h-6 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white">Global Access</h3>
                    <p className="text-sm text-gray-400">Trade and transact from anywhere in the world without currency barriers.</p>
                  </div>
               </div>
               <div className="flex gap-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <ShieldCheck className="text-green-400 w-6 h-6 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white">Secure Storage</h3>
                    <p className="text-sm text-gray-400">Industry-leading encryption keeps your earned assets safe.</p>
                  </div>
               </div>
               <div className="flex gap-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <Zap className="text-yellow-400 w-6 h-6 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white">Instant Settlements</h3>
                    <p className="text-sm text-gray-400">Auctions and sales settle instantly into your wallet balance.</p>
                  </div>
               </div>
               <div className="flex gap-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <ArrowRightLeft className="text-purple-400 w-6 h-6 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white">Easy Withdrawals</h3>
                    <p className="text-sm text-gray-400">Withdraw your ArtCoins to your bank account or UPI with minimal processing time.</p>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Policies Section */}
        <Card className="dark:bg-secondary-color border-zinc-800">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Lock className="text-main-color w-5 h-5" />
                Policies & Fees
             </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <h4 className="font-medium text-white">Platform Commission</h4>
                <p className="text-sm text-gray-400">
                   To maintain the ArtChain ecosystem, we charge a small commission on successful transactions.
                </p>
                <div className="flex gap-4 mt-2">
                   <div className="px-4 py-2 rounded bg-zinc-900 border border-zinc-700">
                      <span className="text-xs text-gray-500 block">Auction Sales</span>
                      <span className="font-item text-lg text-main-color">{auctionCommissionPercentage}%</span>
                   </div>
                   <div className="px-4 py-2 rounded bg-zinc-900 border border-zinc-700">
                      <span className="text-xs text-gray-500 block">Direct Sales</span>
                      <span className="font-item text-lg text-main-color">{artSaleCommissionPercentage}%</span>
                   </div>
                    <div className="px-4 py-2 rounded bg-zinc-900 border border-zinc-700">
                      <span className="text-xs text-gray-500 block">Commission Art</span>
                      <span className="font-item text-lg text-main-color">{commissionArtPercentage}%</span>
                   </div>
                </div>
             </div>

             <div className="space-y-2">
                <h4 className="font-medium text-white">Withdrawal Processing</h4>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                   <li>Minimum withdrawal amount is 100 AC.</li>
                   <li>Withdrawals are typically processed within 7 business days.</li>
                   <li>Bank holidays may affect processing times for Bank Transfers.</li>
                   <li>Ensure your banking details are accurate to avoid rejection and refund delays.</li>
                </ul>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Side Info / Art Coin Stats */}
      <div className="space-y-6">
         <Card className="dark:bg-secondary-color border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950">
            <CardHeader>
               <CardTitle className="text-lg">What is ArtCoin?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-center py-6">
                  <div className="relative">
                     <div className="absolute inset-0 bg-main-color/20 blur-xl rounded-full"></div>
                     <Coins className="w-24 h-24 text-main-color relative z-10" />
                  </div>
               </div>
               <p className="text-sm text-gray-300 text-center">
                  ArtCoin (AC) is the native utility token of the ArtChain platform. It powers the economy, enabling seamless value transfer between creators and collectors.
               </p>
               <div className="bg-zinc-900/80 p-4 rounded-lg border border-zinc-700">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-sm text-gray-400">Current Rate</span>
                     <span className="text-xs text-green-400 bg-green-900/20 px-2 py-0.5 rounded-full">Live</span>
                  </div>
                  <div className="text-3xl font-bold font-item">
                     1 AC = ₹{artCoinRate}
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="dark:bg-secondary-color border-zinc-800 border-l-4 border-l-main-color">
            <CardContent className="pt-6">
               <h4 className="font-semibold text-white mb-2">Need Help?</h4>
               <p className="text-sm text-gray-400 mb-4">
                  If you have questions about your wallet balance, transactions, or withdrawal status, our support team is here to assist you.
               </p>
               <button className="text-main-color text-sm font-medium hover:underline">
                  Contact Support →
               </button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default AboutWalletContent;
