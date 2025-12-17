import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Users, Gift, Copy, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { formatNumber } from "../../../../libs/formatNumber";

const ReferralContent: React.FC = () => {
  const { welcomeBonus, referralBonus } = useSelector((state: RootState) => state.platform);
  const user = useSelector((state: RootState) => state.user.user);
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/register?ref=${user?.username || user?.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Side: Referral Info */}
      <div className="space-y-6">
        <Card className="dark:bg-secondary-color border-zinc-800 h-full flex flex-col justify-center">
            <CardHeader className="text-center">
                <div className="mx-auto bg-main-color/10 p-4 rounded-full w-fit mb-4">
                    <Gift className="w-12 h-12 text-main-color" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-main-color to-purple-400 bg-clip-text text-transparent">
                    Refer & Earn
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                    Invite friends to ArtChain and earn rewards together!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 text-center">
                         <p className="text-gray-400 text-sm uppercase tracking-wider font-medium mb-1">They Get</p>
                         <h3 className="text-2xl font-bold text-white">{formatNumber(welcomeBonus)} AC</h3>
                         <p className="text-xs text-gray-500 mt-1">Welcome Bonus</p>
                    </div>
                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 text-center">
                         <p className="text-gray-400 text-sm uppercase tracking-wider font-medium mb-1">You Get</p>
                         <h3 className="text-2xl font-bold text-white">{formatNumber(referralBonus)} AC</h3>
                         <p className="text-xs text-gray-500 mt-1">Per Referral</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Your Referral Link</label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-gray-400 truncate font-mono">
                                {referralLink}
                            </div>
                            <Button 
                                onClick={copyToClipboard}
                                className={`min-w-[100px] ${copied ? "bg-green-600 hover:bg-green-700" : "bg-main-color hover:bg-main-color/90"}`}
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        Share this link with your friends on social media or direct messages.
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Right Side: How it works & Stats */}
      <div className="space-y-6">
          <Card className="dark:bg-secondary-color border-zinc-800">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-main-color" />
                    How it works
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-6 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-zinc-800"></div>

                    <div className="relative pl-10">
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm font-bold text-main-color z-10">1</div>
                        <h4 className="font-semibold text-white">Invite Friends</h4>
                        <p className="text-sm text-gray-400 mt-1">Share your unique referral link with friends and followers.</p>
                    </div>
                    <div className="relative pl-10">
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm font-bold text-main-color z-10">2</div>
                        <h4 className="font-semibold text-white">They Register</h4>
                        <p className="text-sm text-gray-400 mt-1">Friends sign up using your link and verify their account.</p>
                    </div>
                     <div className="relative pl-10">
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm font-bold text-main-color z-10">3</div>
                        <h4 className="font-semibold text-white">Earn Rewards</h4>
                        <p className="text-sm text-gray-400 mt-1">
                            You get {formatNumber(referralBonus)} AC instantly, and they get {formatNumber(welcomeBonus)} AC just for joining!
                        </p>
                    </div>
                </div>
             </CardContent>
          </Card>

          <Card className="dark:bg-secondary-color border-zinc-800">
              <CardHeader>
                  <CardTitle className="text-lg">Your Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                      <div>
                          <p className="text-gray-400 text-sm">Total Referrals</p>
                          <p className="text-2xl font-bold text-white">0</p>
                      </div>
                      <div>
                          <p className="text-gray-400 text-sm">Total Earned</p>
                          <p className="text-2xl font-bold text-main-color">0 AC</p>
                      </div>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-4 italic">
                      Start referring to see your stats grow!
                  </p>
              </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default ReferralContent;
