import React, { useState } from 'react';
import { usePurchasedAnalytics } from '../../../hooks/settings/purchase/usePurchasedAnalytics';
import { usePurchasedArt } from '../../../hooks/settings/purchase/usePurchasedArt';
import PurchasedAnalyticsHero from './PurchasedAnalyticsHero';
import PurchasedArtGrid from './PurchasedArtGrid';

const PurchaseHistory: React.FC = () => {
  const [range, setRange] = useState('7d');
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data: analytics, isLoading: isChartLoading } = usePurchasedAnalytics(range);
  const { data: artworks, isLoading: isArtLoading } = usePurchasedArt(page, limit);

  const isFetching = isChartLoading || isArtLoading;
  const hasNoData = !isFetching && (!artworks || artworks.length === 0);

  return (
    <div className="p-4 sm:p-0 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Purchase History
          </h1>
          <p className="text-zinc-500 text-sm">
            View your purchase history and analytics
          </p>
        </div>

        {!isFetching && !hasNoData && (
          <div className="flex p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5 backdrop-blur-xl">
            {['today', '7d', '30d', 'all'].map((r) => (
              <button
                key={r}
                onClick={() => { setRange(r); setPage(1); }}
                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tighter transition-all ${
                  range === r 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {isFetching ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      ) : hasNoData ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="text-zinc-600 text-xl opacity-50">Empty Vault</div>
          <p className="text-zinc-500 mt-2">You haven't purchased any artwork yet.</p>
        </div>
      ) : (
        <>
          <PurchasedAnalyticsHero 
            analytics={analytics} 
            isLoading={isChartLoading} 
          />
          <PurchasedArtGrid 
            artworks={artworks || []} 
            isLoading={isArtLoading}
            page={page}
            setPage={setPage}
            limit={limit}
          />
        </>
      )}
    </div>
  );
};

export default PurchaseHistory;