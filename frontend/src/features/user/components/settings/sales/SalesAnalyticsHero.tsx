import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HeroProps {
  analytics: any;
  isChartLoading: boolean;
  range: string;
}

const SalesAnalyticsHero: React.FC<HeroProps> = ({ analytics, isChartLoading, range }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 ">
      <div className={`lg:col-span-3 dark:bg-zinc-900/30 border border-emerald-500/20 p-6 rounded-[2.5rem] backdrop-blur-sm transition-opacity duration-500 ${isChartLoading ? 'opacity-40 animate-pulse' : 'opacity-100'}`}>
        <div className="h-[250px] w-full relative">
          {isChartLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics || []}>
              <defs>
                <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
              <XAxis
                dataKey="date"
                hide={range === 'today'}
                stroke="#52525b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', fontSize: '12px' }}
                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '5 5' }}
                formatter={(value: any, name: any) => {
                  if (name === "totalAmount") return [`${value} AC`, "Revenue"];
                  return [value, name];
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="totalAmount"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#salesColor)"
                strokeWidth={4}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-emerald-600/10 border border-emerald-500/40 p-8 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/60 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
        <span className="text-emerald-500 text-md sm:text-xl font-bold">Total Revenue</span>
        <h2 className="text-4xl font-black mt-2 tracking-tighter">
          {analytics?.reduce((sum: number, d: any) => sum + (d.totalAmount || 0), 0)?.toLocaleString() || 0}
          <span className="text-xs font-bold text-zinc-600 ml-2 italic text-white/50">AC</span>
        </h2>
        <div className="mt-8 pt-6 border-t border-white/5">
          <span className="text-zinc-500 text-md sm:text-xl font-bold">Transactions</span>
          <p className="text-2xl font-black tracking-tight">
            {analytics?.reduce((sum: number, d: any) => sum + (d.count || 0), 0) || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsHero;