import React, { useState } from 'react';
import { useSalesAnalytics } from '../../../hooks/settings/sales/useSalesAnalytics';
import { useSalesHistory } from '../../../hooks/settings/sales/useSalesHistory';
import SalesAnalyticsHero from './SalesAnalyticsHero';
import SalesHistoryTable from './SalesHistoryTable';

const SalesHistory: React.FC = () => {
  const [page, setPage] = useState(1);
  const [range, setRange] = useState('7d');
  const limit = 10;

  const { data: analytics, isLoading: isChartLoading } = useSalesAnalytics(range);
  const { data: salesData, isLoading: isTableLoading } = useSalesHistory(page, limit);

  // Check if there is absolutely no data to show
  const hasNoData = !isChartLoading && !isTableLoading && (!analytics || analytics.length === 0) && (!salesData || salesData.length === 0);

  return (
    <div className="p-4 sm:p-0 space-y-8">
      {/* HEADER & RANGE SELECTOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sales History
          </h1>
          <p className="text-zinc-500 text-sm">
            Marketplace Performance & Revenue
          </p>
        </div>

        {hasNoData ? <></> : <div className="flex gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/5 backdrop-blur-md">
          {['today', '7d', '30d', 'all'].map((r) => (
            <button
              key={r}
              onClick={() => { setRange(r); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${range === r
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
            >
              {r}
            </button>
          ))}
        </div>
        }

      </div>

      {hasNoData ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-zinc-400">No Sales Found</h3>
          <p className="text-zinc-600 text-sm mt-1">There are no records for the selected period.</p>
        </div>
      ) : (
        <>
          <SalesAnalyticsHero
            analytics={analytics}
            isChartLoading={isChartLoading}
            range={range}
          />

          <SalesHistoryTable
            sales={salesData || []}
            isTableLoading={isTableLoading}
            page={page}
            setPage={setPage}
            limit={limit}
          />
        </>
      )}
    </div>
  );
};

export default SalesHistory;