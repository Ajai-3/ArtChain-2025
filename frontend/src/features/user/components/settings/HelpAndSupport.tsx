import React, { useState } from "react";
import {
  ChevronDown,
  ShoppingBag,
  Gavel,
  Shield,
  Mail,
  MessageCircle,
  BookOpen,
  Zap,
  Coins,
  Lock,
  Gift,
  UserCheck,
  AlertTriangle,
  Flag,
  CheckCircle2,
  TrendingUp,
  Heart,
  Palette,
  ArrowRight,
  Clock,
  Headphones,
  BadgeCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FAQItem {
  q: string;
  a: string;
}
interface Section {
  icon: React.ReactNode;
  label: string;
  faqs: FAQItem[];
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

const FAQItem: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-1.5 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 text-left ${
          open ? "bg-emerald-500/8" : "hover:bg-white/5"
        }`}
      >
        <span
          className={`text-sm pr-4 leading-snug transition-colors ${
            open ? "text-emerald-400 font-semibold" : "text-zinc-400"
          }`}
        >
          {item.q}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-all duration-300 ${
            open ? "rotate-180 text-emerald-500" : "text-zinc-600"
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pt-1 pb-5 text-[13px] leading-relaxed text-zinc-500 border-t border-emerald-500/10 mx-2 mt-1">
          {item.a}
        </p>
      </div>
    </div>
  );
};

// ─── Section Card ─────────────────────────────────────────────────────────────

const SectionCard: React.FC<{ section: Section }> = ({ section }) => (
  <div className="rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/20 transition-all duration-500 group overflow-hidden">
    <div className="flex items-center gap-4 px-6 py-5 border-b border-white/5 group-hover:border-emerald-500/10 transition-colors duration-500">
      <div className="p-2.5 rounded-xl bg-zinc-950 text-emerald-500 border border-white/5 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shrink-0">
        {section.icon}
      </div>
      <h3 className="font-bold text-xs tracking-widest uppercase text-zinc-300">
        {section.label}
      </h3>
    </div>
    <div className="p-3">
      {section.faqs.map((faq, i) => (
        <FAQItem key={i} item={faq} />
      ))}
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const HelpAndSupport: React.FC = () => {
  const [search, setSearch] = useState("");
  const {
    artCoinRate,
    auctionCommissionPercentage,
    artSaleCommissionPercentage,
    commissionArtPercentage,
  } = useSelector((state: RootState) => state.platform);

  const SECTIONS: Section[] = [
    {
      icon: <Palette size={17} />,
      label: "Posting Artwork",
      faqs: [
        {
          q: "How do I upload my artwork?",
          a: "Tap the '+' button on your profile. Upload JPG, PNG, WEBP or GIF (max 20MB). Add a title, description, and tags — then choose if it's a gallery post, for sale, or an auction.",
        },
        {
          q: "Can I edit or delete a post?",
          a: "Yes. Go to the artwork page, open the options (⋯) menu and select Edit or Delete. Deletion is blocked while an active auction has bids.",
        },
      ],
    },
    {
      icon: <ShoppingBag size={17} />,
      label: "Selling Art",
      faqs: [
        {
          q: "How do I list my art for sale?",
          a: "When creating or editing a post, toggle 'For Sale' and set your price in ArtCoins (AC). A green pulse indicator will appear on your card so buyers can find it instantly.",
        },
        {
          q: "How do I get paid?",
          a: `When a collector buys your artwork, ArtCoins are instantly credited to your wallet after a ${artSaleCommissionPercentage}% platform fee is deducted.`,
        },
        {
          q: "What payment methods are supported?",
          a: "All payments are processed securely through Stripe. Buyers can use any major credit or debit card supported by Stripe.",
        },
      ],
    },
    {
      icon: <Gavel size={17} />,
      label: "Auctions",
      faqs: [
        {
          q: "How do I create an auction?",
          a: "Go to the Auction page (not the art post page) and click 'Create Auction'. Select your artwork, set a starting bid, optional reserve price, and choose a duration of 1, 3, 5, or 7 days.",
        },
        {
          q: "What if no one meets the reserve price?",
          a: "The auction ends with no sale and the artwork returns to your gallery. You can relist it at any time.",
        },
        {
          q: `What is the auction fee?`,
          a: `A ${auctionCommissionPercentage}% platform commission is deducted from the final bid before proceeds are credited to your wallet.`,
        },
      ],
    },
    {
      icon: <Lock size={17} />,
      label: "Commission Artwork",
      faqs: [
        {
          q: "How do I request a commission?",
          a: "Visit an artist's profile and click the 'Create Commission' button. Describe your requirements and submit. Both parties must agree before the work begins.",
        },
        {
          q: "How does escrow payment work?",
          a: "Once both parties agree, the buyer's ArtCoins are locked in an escrow wallet held by ArtChain. Funds are only released to the artist after you confirm the final delivery.",
        },
        {
          q: `What is the commission fee?`,
          a: `A ${commissionArtPercentage}% fee is deducted from the agreed amount before the artist receives their payout.`,
        },
      ],
    },
    {
      icon: <Coins size={17} />,
      label: "ArtCoins & Wallet",
      faqs: [
        {
          q: "What is ArtCoin (AC)?",
          a: `ArtCoin is ArtChain's platform currency used for all transactions — buying, selling, auctions, and commissions. Current rate: 1 AC = ₹${artCoinRate}.`,
        },
        {
          q: "How do I add funds to my wallet?",
          a: "Go to Wallet → Add Funds. You'll be taken to Stripe's secure checkout. Pay with any major card — ArtCoins appear in your wallet instantly.",
        },
        {
          q: "How do I withdraw my earnings?",
          a: "Go to Wallet → Withdraw. Minimum withdrawal is 100 AC. Processing takes up to 7 business days. Ensure your bank details are correct to avoid delays.",
        },
        {
          q: "Can I gift ArtCoins to someone?",
          a: "Yes! Use the Gift option on any user's profile or from your Wallet page to send ArtCoins directly to another user.",
        },
      ],
    },
    {
      icon: <UserCheck size={17} />,
      label: "Artist Verification",
      faqs: [
        {
          q: "How do I get verified?",
          a: "You need at least 20 Supporters, be Supporting at least 20 others, and have published 10 posts. Once met, submit a verification request to the admin team from your profile settings.",
        },
        {
          q: "What do I get with a verified badge?",
          a: "A verification badge on your profile, higher buyer trust, better search visibility, and priority in featured collections.",
        },
        {
          q: "How long does review take?",
          a: "The admin team typically reviews requests within a few business days. You'll be notified by email once a decision is made.",
        },
      ],
    },
    {
      icon: <Heart size={17} />,
      label: "Likes & Favorites",
      faqs: [
        {
          q: "What's the difference between Like and Favorite?",
          a: "Likes (❤️) show appreciation and boost an artwork's popularity ranking. Favorites (🔖) privately save it to your Favorites tab for easy access later.",
        },
        {
          q: "Can artists see who liked their work?",
          a: "Artists can see total counts on their posts. Individual user identities are kept private.",
        },
      ],
    },
    {
      icon: <AlertTriangle size={17} />,
      label: "Safety & Reports",
      faqs: [
        {
          q: "How do I report a post or user?",
          a: "Click the options (⋯) menu on any artwork or profile and select 'Report'. Pick a reason and submit — our team reviews all reports within 24 hours.",
        },
        {
          q: "What is the Strike system?",
          a: "Users who break community guidelines receive strikes. Three strikes result in a permanent ban and forfeiture of unverified ArtCoins.",
        },
        {
          q: "My artwork was stolen. What do I do?",
          a: "ArtChain watermarks all displayed images. For DMCA takedowns, email support@artchain.com with proof of ownership and we'll act within 48 hours.",
        },
      ],
    },
  ];

  const filtered = search.trim()
    ? SECTIONS.map((s) => ({
        ...s,
        faqs: s.faqs.filter(
          (f) =>
            f.q.toLowerCase().includes(search.toLowerCase()) ||
            f.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((s) => s.faqs.length > 0)
    : SECTIONS;

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30">

      {/* ── Live rate bar ── */}
      <div className="bg-emerald-500/8 border-b border-emerald-500/15">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <TrendingUp size={13} className="text-emerald-500" />
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
              Live Rate:{" "}
              <span className="text-emerald-400 font-bold ml-1">1 AC = ₹{artCoinRate}</span>
            </span>
          </div>
          <div className="h-3 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
              Stripe Secured
            </span>
          </div>
          <div className="h-3 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <Gift size={13} className="text-emerald-500" />
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
              AC Gifting Enabled
            </span>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[160px] opacity-[0.13] pointer-events-none"
          style={{ background: "radial-gradient(circle, #02a863 0%, transparent 65%)" }}
        />
        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-16 text-center">

          <div className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <BadgeCheck size={12} className="text-emerald-500" />
            <span className="text-[11px] font-bold tracking-[0.15em] text-emerald-400 uppercase">
              ArtChain Help Center
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tighter leading-none">
            How can we{" "}
            <span className="text-emerald-500">help you?</span>
          </h1>
          <p className="text-zinc-500 text-base mb-10 max-w-lg mx-auto leading-relaxed">
            Everything about selling, auctions, commissions, ArtCoins, and keeping your art safe.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <BookOpen
              size={16}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search help topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="relative w-full bg-zinc-900/80 border border-white/8 rounded-2xl pl-13 pr-6 py-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 transition-all px-4"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors text-xs"
              >
                clear
              </button>
            )}
          </div>

          {/* Quick tag filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {["ArtCoins", "Auctions", "Verification", "Commissions", "Withdrawals", "Reports"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="px-3 py-1 text-xs rounded-full border border-white/8 text-zinc-500 hover:border-emerald-500/30 hover:text-emerald-400 transition-all bg-zinc-900/50"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── FAQ Grid ── */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 py-14">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {filtered.map((section) => (
              <SectionCard key={section.label} section={section} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Flag size={40} className="mx-auto text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-medium">No results for "{search}"</p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-xs text-emerald-500 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* ── Contact Section ── */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6">
        <div
          className="rounded-3xl border border-white/5 overflow-hidden"
          style={{ background: "linear-gradient(160deg, #0d1a14 0%, #09120e 100%)" }}
        >
          {/* Top content */}
          <div className="px-10 py-12 flex flex-col md:flex-row items-start md:items-center gap-10 border-b border-white/5">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15">
                <Headphones size={12} className="text-emerald-400" />
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                  Support Team
                </span>
              </div>
              <h2 className="text-3xl font-black text-white mb-3 tracking-tight leading-tight">
                Still have questions?
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                Our admin team handles disputes, DMCA reports, withdrawal issues, and verification
                requests. We typically respond within a few hours.
              </p>
            </div>

            {/* Response time stats */}
            <div className="flex flex-col gap-3 w-full md:w-auto md:shrink-0">
              {[
                { icon: <Clock size={14} />, label: "Avg. response time", value: "~3 hours" },
                { icon: <Shield size={14} />, label: "Reports reviewed in", value: "24 hours" },
                { icon: <Zap size={14} />, label: "Withdrawals processed", value: "7 business days" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-zinc-900/60 border border-white/5"
                >
                  <span className="text-emerald-500">{stat.icon}</span>
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest leading-none mb-0.5">
                      {stat.label}
                    </p>
                    <p className="text-sm font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="px-0 sm:px-10 py-7 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="mailto:support@artchain.com"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #02a863, #059669)" }}
            >
              <Mail size={16} />
              Email support@artchain.com
              <ArrowRight size={14} className="opacity-60" />
            </a>
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/8 transition-all">
              <MessageCircle size={16} />
              Open Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;