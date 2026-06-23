import React from 'react';
import { Label } from '../../../../components/ui/label';
import { Separator } from '../../../../components/ui/separator';
import { Badge } from '../../../../components/ui/badge';
import { Textarea } from '../../../../components/ui/textarea';
import { Input } from '../../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Settings, AlertCircle, ExternalLink } from 'lucide-react';
import type { User } from '../../../../types/users/user/user';

interface QuotaData {
  data: {
    remaining: number;
    limit: number;
  };
}

interface ModelConfig {
  id: string;
  name?: string;
  resolutions?: string[];
  provider?: string;
  availableModels: string[];
  allowedResolutions?: string[];
}

interface LioraSidebarProps {
  user: User | null;
  quota: QuotaData | null;
  model: string;
  setModel: (value: string) => void;
  modelsLoading: boolean;
  availableModels: ModelConfig[];
  resolution: string;
  setResolution: (value: string) => void;
  currentConfig: ModelConfig | null;
  seed: number | '';
  setSeed: (value: number | '') => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
}

export const LioraSidebar: React.FC<LioraSidebarProps> = ({
  user,
  quota,
  model,
  setModel,
  modelsLoading,
  availableModels,
  resolution,
  setResolution,
  currentConfig,
  seed,
  setSeed,
  negativePrompt,
  setNegativePrompt,
}) => {
  return (
    <div className="hidden lg:flex w-80 bg-background border-r border-border flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/liora.png"
              alt="Liora"
              className="w-14 h-14 rounded-2xl object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  Liora
                </h1>
                <a
                  href={
                    import.meta.env.VITE_LIORA_AI_URL ||
                    'https://liora-ai-2025.vercel.app/'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Visit Liora AI"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                AI Image Generator
              </p>
            </div>
          </div>
          {user && <Badge variant="secondary">{user.username}</Badge>}
        </div>

        <Separator />

        {/* Quota Display */}
        {quota && (
          <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Free Generations Today</span>
              <span
                className={
                  quota.data.remaining === 0
                    ? 'text-destructive'
                    : 'text-primary'
                }
              >
                {quota.data.remaining}/{quota.data.limit}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: `${(quota.data.remaining / quota.data.limit) * 100}%`,
                }}
              />
            </div>
            {quota.data.remaining === 0 && (
              <div className="flex items-center gap-2 text-xs text-destructive mt-2">
                <AlertCircle className="w-3 h-3" />
                <span>Free limit reached. ArtCoins will be used.</span>
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <Settings className="w-4 h-4" /> Model
            </Label>
            <Select
              value={model}
              onValueChange={setModel}
              disabled={
                modelsLoading ||
                !availableModels ||
                availableModels.length === 0
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    modelsLoading ? 'Loading models...' : 'Select model'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {modelsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : availableModels?.length > 0 ? (
                  availableModels.flatMap((config: ModelConfig) =>
                    config.availableModels.map((modelName: string) => (
                      <SelectItem
                        key={`desktop-${config.provider}-${modelName}`}
                        value={modelName}
                      >
                        {config.provider === 'gemini'
                          ? 'Google Gemini 2.5 (Paid)'
                          : modelName === 'flux'
                            ? 'Flux.1 Pro (Best Quality)'
                            : modelName === 'sdxl'
                              ? 'SDXL Turbo (Fast)'
                              : modelName}
                      </SelectItem>
                    )),
                  )
                ) : (
                  <SelectItem value="flux" disabled>
                    No models available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <Settings className="w-4 h-4" /> Resolution
            </Label>
            <Select
              value={resolution}
              onValueChange={setResolution}
              disabled={!currentConfig}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                {currentConfig?.allowedResolutions?.map((res: string) => (
                  <SelectItem key={`desktop-res-${res}`} value={res}>
                    {res === '1024x1024'
                      ? '1024×1024 (Square)'
                      : res === '1152x896'
                        ? '1152×896 (Landscape)'
                        : res === '896x1152'
                          ? '896×1152 (Portrait)'
                          : res === '1360x768'
                            ? '1360×768 (Ultra Wide)'
                            : res}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">
                Seed {seed === '' && '(Random)'}
              </Label>
              <Input
                type="number"
                placeholder="Random"
                value={seed}
                onChange={(e) =>
                  setSeed(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Negative Prompt</Label>
            <Textarea
              placeholder="blurry, deformed, ugly, text, watermark..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="min-h-24 resize-none text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
