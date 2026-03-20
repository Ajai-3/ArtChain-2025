import React from "react";
import type { LucideIcon } from "lucide-react";

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  badge?: string;
  className?: string;
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  title,
  value,
  subValue,
  trend,
  icon: Icon,
  badge,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900/50 dark:border-main-color/50 overflow-hidden group ${className}`}
    >
      {/* ── Decorative: top-left ambient glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 -left-6 w-32 h-32 rounded-full bg-main-color"
        style={{ opacity: 0.12, filter: "blur(18px)" }}
      />

      {/* ── Decorative: dot-grid texture — more visible ── */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full text-main-color"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.22 }}
      >
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      {/* ── Decorative: diagonal corner stripes (top-right) — more stripes ── */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -top-px -right-px text-main-color"
        width="110"
        height="110"
        viewBox="0 0 110 110"
        fill="none"
        style={{ opacity: 0.45 }}
      >
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((offset, i) => (
          <line
            key={offset}
            x1={110 - offset} y1={0}
            x2={110} y2={offset}
            stroke="currentColor"
            strokeWidth={i < 6 ? "1.2" : "0.6"}
            opacity={i < 6 ? 1 : 0.5}
          />
        ))}
      </svg>

      {/* ── Decorative: left accent bar — main-color, no white ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-main-color"
        style={{ opacity: 0.9 }}
      />

      {/* ── Decorative: bottom shimmer line ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-4 right-4 h-px bg-main-color"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 30%, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 30%, black 70%, transparent)",
          opacity: 0.5,
        }}
      />

      {/* ── Decorative: top shimmer line ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-8 right-16 h-px bg-main-color"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 40%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 40%, transparent)",
          opacity: 0.35,
        }}
      />

      {/* ── Hover glow wash ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl bg-main-color transition-opacity duration-500 opacity-0 group-hover:opacity-[0.06]"
        style={{ filter: "blur(2px)" }}
      />

      {/* ════ Real content (unchanged) ════ */}

      {/* Header: Icon and Badge */}
      <div className="relative flex items-start justify-between mb-3">
        <div className="rounded-lg p-2.5 bg-main-color/20 ring-1 ring-main-color/30">
          <Icon className="h-6 w-6 text-main-color" />
        </div>
        {badge && (
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium border bg-main-color/15 text-primary border-main-color/40">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      </div>

      {/* Footer: Subvalue and Trend */}
      {(subValue || trend) && (
        <div className="relative mt-4 flex items-center justify-between text-xs">
          {subValue ? (
            <span className="text-muted-foreground truncate max-w-[85%] text-[11px] sm:text-xs">
              {subValue}
            </span>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardStatsCard;