import React from "react";
import { Settings } from "lucide-react";
import { useGetAIConfigs } from "../hooks/ai/useGetAIConfigs";
import { useGetAIAnalytics } from "../hooks/ai/useGetAIAnalytics";
import AIConfigList from "../components/ai/AIConfigList";
import AIAnalytics from "../components/ai/AIAnalytics";
import AdminPageLayout from "../components/common/AdminPageLayout";
import AIConfigPageSkeleton from "../components/ai/AIConfigPageSkeleton";

const AIConfigPage: React.FC = () => {
  const { data: configData, isLoading: isConfigLoading, error: configError } = useGetAIConfigs();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetAIAnalytics();
  
  const configs = configData?.data || [];
  const analytics = analyticsData?.data || { totalGenerations: 0, activeModels: 0 };

  const isLoading = isConfigLoading || isAnalyticsLoading;

  return (
    <AdminPageLayout
      title="AI Generation Settings"
      description="Configure AI providers, manage daily limits, set artcoin costs, and test provider connections."
    >
      {isLoading ? (
        <AIConfigPageSkeleton />
      ) : (
        <>
          {/* Analytics Section */}
          <AIAnalytics 
            totalGenerations={analytics.totalGenerations} 
            activeModels={analytics.activeModels} 
          />

          {/* Error State */}
          {configError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive mb-6">
              <p className="font-semibold">Error loading configurations</p>
              <p className="text-sm mt-1">Please try refreshing the page.</p>
            </div>
          )}

          {/* Content */}
          {!configError && (
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
        </>
      )}
    </AdminPageLayout>
  );
};

export default AIConfigPage;
