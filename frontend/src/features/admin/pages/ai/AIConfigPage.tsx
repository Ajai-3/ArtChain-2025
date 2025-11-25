import React from "react";
import { Settings, Loader2, LayoutDashboard } from "lucide-react";
import { useGetAIConfigs } from "../../hooks/ai/useGetAIConfigs";
import { useGetAIAnalytics } from "../../hooks/ai/useGetAIAnalytics";
import AIConfigList from "../../components/ai/AIConfigList";
import AIAnalytics from "../../components/ai/AIAnalytics";

const AIConfigPage: React.FC = () => {
  const { data: configData, isLoading: isConfigLoading, error: configError } = useGetAIConfigs();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetAIAnalytics();
  
  const configs = configData?.data || [];
  const analytics = analyticsData?.data || { totalGenerations: 0, activeModels: 0 };

  const isLoading = isConfigLoading || isAnalyticsLoading;

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex gap-2 items-center mb-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">AI Generation Settings</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Configure AI providers, manage daily limits, set artcoin costs, and test provider connections.
          </p>
        </div>

        {/* Analytics Section */}
        {!isLoading && (
          <AIAnalytics 
            totalGenerations={analytics.totalGenerations} 
            activeModels={analytics.activeModels} 
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading configurations...</span>
          </div>
        )}

        {/* Error State */}
        {configError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive mb-6">
            <p className="font-semibold">Error loading configurations</p>
            <p className="text-sm mt-1">Please try refreshing the page.</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !configError && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Provider Configurations</h2>
              <p className="text-sm text-muted-foreground">
                {configs.length} provider{configs.length !== 1 ? 's' : ''} configured
              </p>
            </div>

            {configs.length === 0 ? (
              <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
                <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No AI providers configured yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Run the seed script to initialize default providers.</p>
              </div>
            ) : (
              <AIConfigList configs={configs} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AIConfigPage;
