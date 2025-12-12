import { ShieldCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

interface VerifiedArtistBadgeProps {
  isVerified?: boolean;
  role?: string;
  className?: string;
  showTooltip?: boolean;
}

export const VerifiedArtistBadge = ({ 
  isVerified, 
  role, 
  className = "h-3 w-3 text-blue-500",
  showTooltip = true 
}: VerifiedArtistBadgeProps) => {
  if (!isVerified && role !== "artist") return null;

  const Badge = (
    <span className="inline-flex items-center justify-center align-middle ml-1">
      <ShieldCheck className={className} aria-label="Verified Artist" />
    </span>
  );

  if (!showTooltip) return Badge;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{Badge}</TooltipTrigger>
        <TooltipContent>
          <p className="text-xs font-semibold">Verified Artist</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
