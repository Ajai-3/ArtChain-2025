import React from 'react';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface Props {
    analytics: any;
    isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-bold" style={{ color: "#02a863" }}>
                    {payload[0].value}{" "}
                    <span className="text-zinc-600 font-normal text-xs">AC</span>
                </p>
            </div>
        );
    }
    return null;
};

const PurchasedAnalyticsHero: React.FC<Props> = ({ analytics, isLoading }) => {
    const trend = analytics?.purchaseTrend || [];
    const totalAmount = analytics?.totalAmount ?? 0;
    const totalPurchases = analytics?.totalPurchases ?? 0;

    return (
        <div
            className="rounded-3xl overflow-hidden bg-zinc-300 dark:bg-[#080e0b]"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3">

                <div
                    className="flex flex-col justify-between p-4 lg:border-r"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <span
                                className="inline-block w-1.5 h-1.5 rounded-full"
                            />
                            <span className="text-xl dark:text-zinc-400 font-bold">
                                Purchase Overview
                            </span>
                        </div>

                        <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Total Spent</p>
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-5xl font-black text-white tracking-tighter leading-none">
                                {totalAmount.toLocaleString()}
                            </span>
                            <span className="text-sm font-bold mb-1" style={{ color: "#02a863" }}>AC</span>
                        </div>
                    </div>

                    <div
                        className="my-8 h-px"
                        style={{ background: "linear-gradient(90deg, #02a86325, transparent)" }}
                    />

                    <div>
                        <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">Artworks Owned</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white tracking-tighter leading-none">
                                {totalPurchases}
                            </span>
                            <span className="text-xs text-zinc-600 mb-1.5">pieces</span>
                        </div>

                        <div className="mt-5 h-1 w-full rounded-full bg-zinc-900">
                            <div
                                className="h-1 rounded-full transition-all duration-700"
                                style={{
                                    width: totalPurchases > 0 ? `${Math.min((totalPurchases / 20) * 100, 100)}%` : "4px",
                                    background: "linear-gradient(90deg, #02a863, #34d399)",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Right chart ── */}
                <div className="lg:col-span-2 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
                            Spending Trend
                        </p>
                        {isLoading && (
                            <div
                                className="w-3.5 h-3.5 rounded-full border-2 animate-spin"
                                style={{ borderColor: "#02a86350", borderTopColor: "transparent" }}
                            />
                        )}
                    </div>

                    <div
                        className={`flex-1 min-h-[180px] transition-opacity duration-500 ${isLoading ? "opacity-30 animate-pulse" : "opacity-100"
                            }`}
                    >
                        {trend.length === 0 && !isLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-xs text-zinc-700 uppercase tracking-widest">
                                    No data for this period
                                </p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={trend}
                                    barSize={28}
                                    margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                                >
                                    <XAxis
                                        dataKey="date"
                                        stroke="#3f3f46"
                                        fontSize={9}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={8}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: "#02a86308" }}
                                    />
                                    <Bar dataKey="amount" radius={[6, 6, 2, 2]}>
                                        {trend.map((_: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={index === trend.length - 1 ? "#02a863" : "#02a86330"}
                                            />
                                        ))}
                                    </Bar>
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#02a863"
                                        strokeWidth={2}
                                        dot={{ r: 3, fill: "#02a863", strokeWidth: 0 }}
                                        activeDot={{ r: 5, fill: "#02a863", strokeWidth: 0 }}
                                        strokeDasharray="0"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchasedAnalyticsHero;