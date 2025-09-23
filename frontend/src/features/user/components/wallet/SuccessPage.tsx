import { useNavigate, useSearchParams } from "react-router-dom";
import { useStripeSession } from "../../hooks/wallet/useStripeSession";
import { Button } from "../../../../components/ui/button";
import { Check, Mail, Phone, Share2, Star, Coins, Wallet } from "lucide-react";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  const {
    data: session,
    isLoading,
    isError,
    error,
  } = useStripeSession(sessionId);

  if (isLoading)
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-100 to-white dark:from-zinc-900 dark:to-black flex items-center justify-center p-4">
        <div className="bg-white dark:bg-secondary-color border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 text-center max-w-md w-full shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main-color mx-auto mb-4"></div>
          <div className="text-gray-800 dark:text-white text-lg">
            Loading payment details...
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-100 to-white dark:from-zinc-900 dark:to-black flex items-center justify-center p-4">
        <div className="bg-white dark:bg-secondary-color border border-red-500/30 rounded-2xl p-6 text-center max-w-md w-full shadow-md">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <div className="text-red-500 text-lg mb-2">Payment Error</div>
          <div className="text-gray-600 dark:text-gray-400">
            {error?.message}
          </div>
          <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
            Try Again
          </Button>
        </div>
      </div>
    );

  if (!session)
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-100 to-white dark:from-zinc-900 dark:to-black flex items-center justify-center p-4">
        <div className="bg-white dark:bg-secondary-color border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 text-center max-w-md w-full shadow-md">
          <div className="text-gray-600 dark:text-gray-400 text-lg">
            No session found
          </div>
        </div>
      </div>
    );

  const artCoins = Math.floor(session.amountPaid / 10);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-100 to-white dark:from-zinc-900 dark:to-black overflow-auto py-2">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-main-color/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative max-w-3xl mx-auto pt-4 pb-6 z-10 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-main-color font-logo text-2xl sm:text-3xl md:text-4xl font-bold">
              ArtChain
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Digital Art Marketplace
            </p>
          </div>
          <Button
            variant="outline"
            className="border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-transparent"
            onClick={() => navigate("/wallet")}
          >
            <Wallet className="w-4 h-4 mr-2" />
            My Wallet
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-3xl mx-auto mt-2 z-10 px-4 sm:px-6">
        <div className="bg-white dark:bg-secondary-color/80 backdrop-blur-lg border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Section */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 p-6 sm:p-8">
              <div className="text-center lg:text-left">
                {/* Success Animation */}
                <div className="flex justify-center lg:justify-start mb-6 relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-main-color rounded-full flex items-center justify-center shadow-lg z-10 relative">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -inset-2 rounded-full bg-green-500/30 animate-pulse"></div>
                  <div className="absolute -inset-3 rounded-full bg-green-500/10 animate-ping"></div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Payment Successful!
                </h2>

                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm sm:text-base">
                  You've successfully added
                </p>

                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-gray-200 dark:bg-zinc-700/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                    <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {artCoins}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Art Coins
                    </span>
                  </div>
                </div>

                <div className="bg-gray-100 dark:bg-zinc-800/50 rounded-xl p-3 sm:p-4 mb-6">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{session.amountPaid.toFixed(2)}
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                    Amount Paid
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {[
                    "Instant coin credit to wallet",
                    "Secure & encrypted transaction",
                    "24/7 customer support",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm"
                    >
                      <Star className="w-4 h-4 text-yellow-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Transaction Details
              </h3>
              <div className="space-y-3">
                {[
                  ["Payment ID", session.sessionId],
                  ["User ID", session.userId],
                  ["Status", session.paymentStatus || "Completed"],
                  ["Date", new Date().toLocaleDateString()],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-zinc-700"
                  >
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {label}
                    </span>
                    <span
                      className={`text-sm ${
                        label === "Status"
                          ? "text-green-600 dark:text-green-400 font-semibold"
                          : "text-gray-900 dark:text-white font-mono"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Share Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    Share your success
                  </span>
                  <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex gap-2">
                  {["Twitter", "WhatsApp", "Instagram"].map((name) => (
                    <Button
                      key={name}
                      variant="outline"
                      className="flex-1 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-400 dark:hover:border-zinc-500 text-xs sm:text-sm"
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <Button
                  className="w-full bg-main-color hover:bg-main-color-dark h-11 text-base font-semibold flex items-center justify-center gap-2 text-white"
                  onClick={() => navigate("/wallet")}
                >
                  <Wallet className="w-4 h-4" />
                  Go to Wallet
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-main-color" />
                    <a
                      href="mailto:artchain001@gmail.com"
                      className="hover:text-main-color transition-colors"
                    >
                      artchain001@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-main-color" />
                    <span>8714642273</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 bg-gray-50 dark:bg-zinc-800/50 backdrop-blur-lg border border-gray-200 dark:border-zinc-700 rounded-xl p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            <span className="font-semibold text-main-color">Terms:</span> You
            agree to share information with ArtChain and Razorpay, adhering to
            applicable laws.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative max-w-3xl mx-auto mt-4 text-center z-10 px-4">
        <p className="text-gray-600 dark:text-gray-500 text-xs sm:text-sm">
          © 2024 ArtChain. All rights reserved. Secure payments powered by
          Razorpay.
        </p>
      </footer>
    </div>
  );
};

export default SuccessPage;
