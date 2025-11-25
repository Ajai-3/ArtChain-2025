import React, { useState } from "react";
import { Cpu, Edit, Activity, Loader2, Save, X } from "lucide-react";
import { useUpdateAIConfig } from "../../hooks/ai/useUpdateAIConfig";
import { useTestAIProvider } from "../../hooks/ai/useTestAIProvider";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Switch } from "../../../../components/ui/switch";

interface AIConfigListProps {
  configs: any[];
}

const AIConfigList: React.FC<AIConfigListProps> = ({ configs }) => {
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateAIConfig();
  const { mutate: testProvider, isPending: isTesting } = useTestAIProvider();
  
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleOpenEdit = (config: any) => {
    setEditingConfig(config);
    setFormData({
      enabled: config.enabled,
      dailyFreeLimit: config.dailyFreeLimit,
      artcoinCostPerImage: config.artcoinCostPerImage,
      apiKey: '',
      displayName: config.displayName,
      isFree: config.isFree,
    });
  };

  const handleCloseEdit = () => {
    setEditingConfig(null);
    setFormData({});
  };

  const handleSave = () => {
    if (editingConfig) {
      console.log('=== SAVING AI CONFIG ===');
      console.log('Provider:', editingConfig.provider);
      console.log('Form Data:', formData);
      
      // Only send changed fields
      const updates: any = {};
      if (formData.enabled !== editingConfig.enabled) updates.enabled = formData.enabled;
      if (formData.dailyFreeLimit !== editingConfig.dailyFreeLimit) updates.dailyFreeLimit = formData.dailyFreeLimit;
      if (formData.artcoinCostPerImage !== editingConfig.artcoinCostPerImage) updates.artcoinCostPerImage = formData.artcoinCostPerImage;
      if (formData.apiKey) updates.apiKey = formData.apiKey;
      if (formData.displayName !== editingConfig.displayName) updates.displayName = formData.displayName;
      if (formData.isFree !== editingConfig.isFree) updates.isFree = formData.isFree;

      console.log('Updates to send:', updates);

      updateConfig(
        { provider: editingConfig.provider, ...updates },
        {
          onSuccess: () => {
            handleCloseEdit();
          },
        }
      );
    }
  };

  const handleToggleEnabled = (config: any) => {
    console.log('=== TOGGLING ENABLED ===');
    console.log('Provider:', config.provider);
    console.log('New state:', !config.enabled);
    updateConfig({ provider: config.provider, enabled: !config.enabled });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configs.map((config) => (
          <Card
            key={config.provider}
            className={`p-4 bg-card border-2 transition-all hover:shadow-md ${
              config.enabled ? 'border-green-500/30' : 'border-border'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    config.enabled
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Cpu size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {config.displayName || config.provider}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={config.enabled ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {config.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge
                      variant={config.isFree ? 'outline' : 'default'}
                      className="text-xs"
                    >
                      {config.isFree ? 'Free' : 'Paid'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Free Limit</p>
                <p className="font-semibold">{config.dailyFreeLimit}/day</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Cost</p>
                <p className="font-semibold">{config.artcoinCostPerImage} AC</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Models</p>
                <p className="font-semibold text-xs truncate">
                  {config.availableModels?.join(', ') || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Priority</p>
                <p className="font-semibold">{config.priority || 99}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => testProvider(config.provider)}
                disabled={isTesting}
                className="flex-1"
              >
                {isTesting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Activity className="w-3 h-3" />
                )}
                <span className="ml-2">Test</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(config)}
                className="flex-1"
              >
                <Edit className="w-3 h-3" />
                <span className="ml-2">Edit</span>
              </Button>
              <Switch
                checked={config.enabled}
                onCheckedChange={() => handleToggleEnabled(config)}
                disabled={isUpdating}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingConfig} onOpenChange={handleCloseEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Edit {editingConfig?.displayName || editingConfig?.provider}
            </DialogTitle>
            <DialogDescription>
              Configure settings for this AI provider
            </DialogDescription>
          </DialogHeader>

          {editingConfig && (
            <div className="space-y-4 py-4">
              {/* Display Name */}
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  value={formData.displayName || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  placeholder="e.g., Flux Pro AI"
                />
              </div>

              {/* Enabled Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this provider available to users
                  </p>
                </div>
                <Switch
                  checked={formData.enabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, enabled: checked })
                  }
                />
              </div>

              {/* Free Provider Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Free Provider</Label>
                  <p className="text-sm text-muted-foreground">
                    Offer free daily generations
                  </p>
                </div>
                <Switch
                  checked={formData.isFree}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFree: checked })
                  }
                />
              </div>

              {/* Daily Free Limit */}
              <div className="space-y-2">
                <Label>Daily Free Limit</Label>
                <Input
                  type="number"
                  value={formData.dailyFreeLimit || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dailyFreeLimit: parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Number of free generations per user per day
                </p>
              </div>

              {/* ArtCoin Cost */}
              <div className="space-y-2">
                <Label>Cost Per Image (ArtCoins)</Label>
                <Input
                  type="number"
                  value={formData.artcoinCostPerImage || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      artcoinCostPerImage: parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Cost when free limit is exceeded
                </p>
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <Label>
                  API Key{' '}
                  {editingConfig.provider === 'pollinations' && (
                    <span className="text-muted-foreground">(Not Required)</span>
                  )}
                  {editingConfig.provider === 'gemini' && (
                    <span className="text-orange-500">(Required)</span>
                  )}
                </Label>
                <Input
                  type="password"
                  value={formData.apiKey || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, apiKey: e.target.value })
                  }
                  placeholder={
                    editingConfig.provider === 'pollinations'
                      ? 'Not needed for Pollinations'
                      : editingConfig.provider === 'gemini'
                      ? 'Enter your Gemini API key'
                      : 'Enter API key if required'
                  }
                />
                {editingConfig.provider === 'gemini' && (
                  <p className="text-xs text-orange-500">
                    Get your key from{' '}
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEdit} disabled={isUpdating}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIConfigList;
