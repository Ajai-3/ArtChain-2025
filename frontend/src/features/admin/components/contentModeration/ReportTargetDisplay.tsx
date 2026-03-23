import React from "react";
import { useGetReportTarget } from "../../hooks/contentModeration/useGetReportTarget";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Button } from "../../../../components/ui/button";
import { ExternalLink } from "lucide-react";

interface ReportTargetDisplayProps {
  targetId: string;
  targetType: "ART" | "COMMENT" | "USER";
}

export const ReportTargetDisplay: React.FC<ReportTargetDisplayProps> = ({
  targetId,
  targetType,
}) => {
  const { data, isLoading, isError } = useGetReportTarget(targetId, targetType);

  if (isLoading) return <Skeleton className="h-10 w-full" />;
  if (isError || !data) return <span className="text-destructive text-xs">Content unavailable</span>;

  if (targetType === "USER") {
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={data.profileImage} />
            <AvatarFallback>{data.username?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{data.username}</span>
            <span className="text-xs text-muted-foreground">{data.email}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(`/${data.username}`, '_blank')}
          className="shrink-0"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Profile
        </Button>
      </div>
    );
  }

  if (targetType === "ART") {
    const art = data.art;
    const user = data.user;
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded overflow-hidden bg-muted border">
               <img src={art?.previewUrl} alt="Art" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground truncate max-w-[200px]">
              {art?.artName || art?.title || "Untitled Art"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Avatar className="h-4 w-4">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="text-[10px]">{user?.username?.[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">by {user?.username}</span>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(`/${user?.username}/art/${art?.artName}`, '_blank')}
          className="shrink-0"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Art
        </Button>
      </div>
    );
  }

  if (targetType === "COMMENT") {
    const comment = data;
    const user = data.user;
    const art = data.art;
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="text-xs">{user?.username?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">{user?.username}</span>
              <span className="text-[10px] text-muted-foreground">Owner of comment</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (art && art.user) {
                window.open(`/${art.user.username}/art/${art.artName}`, '_blank');
              } else {
                console.warn("Art or Art Owner not found for navigation context");
              }
            }}
            className="h-7 text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Context
          </Button>
        </div>
        {art && (
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] text-muted-foreground">Reported on artwork: </span>
             <span className="text-[10px] font-semibold text-primary">{art.artName}</span>
          </div>
        )}
        <div className="bg-muted/50 rounded-lg p-3 border">
          <p className="text-sm text-foreground italic">"{comment.content || comment.text || "No content"}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-sm text-muted-foreground">
      <span className="font-mono text-xs bg-muted px-1 rounded">{targetId}</span>
    </div>
  );
};
