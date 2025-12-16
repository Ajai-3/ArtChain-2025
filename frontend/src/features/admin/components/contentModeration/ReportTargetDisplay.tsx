import React from "react";
import { useGetReportTarget } from "../../hooks/contentModeration/useGetReportTarget";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Skeleton } from "../../../../components/ui/skeleton";

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
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={data.profileImage} />
          <AvatarFallback>{data.username?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{data.username}</span>
          <span className="text-xs text-muted-foreground">{data.email}</span>
        </div>
      </div>
    );
  }

  if (targetType === "ART") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded overflow-hidden bg-muted">
             <img src={data.previewUrl} alt="Art" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground truncate max-w-[150px]">{data.artName || data.title || "Untitled Art"}</span>
        </div>
      </div>
    );
  }

  if (targetType === "COMMENT") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={data.user?.profileImage} />
            <AvatarFallback className="text-xs">{data.user?.username?.[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{data.user?.username}</span>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 border">
          <p className="text-sm text-foreground line-clamp-3">{data.content || data.text || "No content"}</p>
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
