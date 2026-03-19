
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { ArrowLeft, ExternalLink, Gavel, Trophy, User, Circle } from "lucide-react";
import { formatNumber } from "../../../../libs/formatNumber";


const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
    ACTIVE: { label: "Live", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)" },
    ENDED: { label: "Ended", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)" },
    SCHEDULED: { label: "Upcoming", color: "#818cf8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.25)" },
    CANCELLED: { label: "Cancelled", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
};


export const BidCard = ({ item }: { item: any }) => {
    const navigate = useNavigate();
    const cfg = STATUS_CONFIG[item.auction.status] ?? STATUS_CONFIG.UNSOLD;
    const isEnded = item.auction.status === "ENDED";
    const hasWinner = isEnded && !!item.winner;

    return (
        <div
            onClick={() => navigate(`/bidding/${item.auction.id}`)}
            className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
            style={{ background: "#111412", border: `1px solid ${cfg.border}` }}
        >
            {/* ── Image block — fixed height, no overflow glitch ── */}
            <div className="relative w-full h-48 overflow-hidden shrink-0">
                <img
                    src={item.auction.imageUrl}
                    alt={item.auction.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />

                {/* Persistent bottom scrim for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                {/* Status pill — top left */}
                <div
                    className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, backdropFilter: "blur(8px)" }}
                >
                    <Circle
                        size={7}
                        className="fill-current shrink-0"
                        style={{
                            color: cfg.color,
                            filter: item.auction.status === "ACTIVE" ? `drop-shadow(0 0 3px ${cfg.color})` : "none",
                        }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
                        {cfg.label}
                    </span>
                </div>

                {/* Winner trophy — top right */}
                {hasWinner && (
                    <div
                        className="absolute top-3 right-3 p-1.5 rounded-full"
                        style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", backdropFilter: "blur(8px)" }}
                    >
                        <Trophy size={13} color="#fbbf24" />
                    </div>
                )}

                {/* Host row — bottom of image, always visible */}
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex items-center gap-2">
                    <Avatar className="h-7 w-7 shrink-0 ring-2 ring-black/40">
                        <AvatarImage src={item.host?.profileImage} className="object-cover" />
                        <AvatarFallback className="bg-zinc-800 text-[9px]"><User size={11} /></AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-white/40 uppercase tracking-widest leading-none mb-0.5">Host</span>
                        <span className="text-xs text-white font-semibold truncate leading-none drop-shadow">
                            {item.host?.name ?? item.host?.username ?? "Unknown"}
                        </span>
                        <span className="text-[10px] text-white/50 truncate leading-none">
                            @{item.host?.username}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-col flex-1 p-4 gap-3">

                {/* Title */}
                <p className="text-sm font-bold text-white line-clamp-1 leading-snug">
                    {item.auction.title}
                </p>

                {/* Bid box */}
                <div
                    className="flex items-center justify-between px-3 py-3 rounded-xl"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                    <div>
                        <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-0.5 leading-none">
                            {isEnded ? "Final Price" : "Top Bid"}
                        </p>
                        <p className="text-lg font-black tabular-nums leading-none" style={{ color: cfg.color }}>
                            {formatNumber(item.auction.currentBid)}
                            <span className="text-[11px] font-normal text-zinc-600 ml-1">AC</span>
                        </p>
                    </div>
                    {hasWinner
                        ? <Trophy size={16} color="#fbbf24" />
                        : <Gavel size={16} color="#3f3f46" />
                    }
                </div>

                {/* Winner highlight — prominent when present */}
                {hasWinner && (
                    <div
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                        style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}
                    >
                        <div className="relative shrink-0">
                            <Avatar className="h-8 w-8 ring-2 ring-amber-500/30">
                                <AvatarImage src={item.winner.profileImage} className="object-cover" />
                                <AvatarFallback className="bg-zinc-800 text-[9px]"><User size={11} /></AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-0.5 -right-0.5 bg-amber-500 rounded-full p-0.5">
                                <Trophy size={7} color="white" />
                            </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[9px] text-amber-500/70 uppercase tracking-widest leading-none mb-0.5">
                                Winner
                            </span>
                            <span className="text-xs font-bold text-amber-400 truncate leading-none">
                                {item.winner.name ?? item.winner.username}
                            </span>
                            <span className="text-[10px] text-amber-500/50 truncate leading-none">
                                @{item.winner.username}
                            </span>
                        </div>
                    </div>
                )}

                {/* CTA */}
                <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/bidding/${item.auction.id}`); }}
                    className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:opacity-80 active:scale-[0.98]"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
                >
                    View Auction <ExternalLink size={11} />
                </button>
            </div>
        </div>
    );
};
