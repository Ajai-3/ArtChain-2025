import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";

interface Reporter {
  id: string;
  username: string;
  profileImage: string | null;
}

interface ReporterAvatarStackProps {
  reporters: Reporter[];
  maxVisible?: number;
}

export const ReporterAvatarStack: React.FC<ReporterAvatarStackProps> = ({
  reporters,
  maxVisible = 3,
}) => {
  const visibleReporters = reporters.slice(0, maxVisible);
  const remainingCount = reporters.length - maxVisible;

  return (
    <div className="flex items-center -space-x-2">
      {visibleReporters.map((reporter, index) => (
        <Avatar
          key={reporter.id}
          className="h-8 w-8 border-2 border-background"
          style={{ zIndex: visibleReporters.length - index }}
        >
          <AvatarImage src={reporter.profileImage || undefined} />
          <AvatarFallback className="text-xs">
            {reporter.username[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium"
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
