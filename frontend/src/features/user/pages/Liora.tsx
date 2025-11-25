import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { Badge } from "../../../components/ui/badge";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  Sparkles,
  Settings,
  Image as ImageIcon,
  Download,
  Share2,
  Zap,
  Wand2,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "../../../libs/utils";
import { useGenerateAIImage } from "../hooks/ai/useGenerateAIImage";
import { useCheckAIQuota } from "../hooks/ai/useCheckAIQuota";
import { useGetAvailableModels } from "../hooks/ai/useGetAvailableModels";

const Liora: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState("");
  const [resolution, setResolution] = useState("1024x1024");
  const [seed, setSeed] = useState<number | "">("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useSelector((state: RootState) => state.user.user);

  const { mutate: generateImage, isPending: isGenerating} = useGenerateAIImage();
  const { data: availableModels, isLoading: modelsLoading } = useGetAvailableModels();
  const { data: quota } = useCheckAIQuota();

  // Set default model when availableModels are loaded
  useEffect(() => {
    if (availableModels && availableModels.length > 0 && !model) {
      const firstConfig = availableModels[0];
      const defaultModel = firstConfig.defaultModel || firstConfig.availableModels[0];
      if (defaultModel) {
        setModel(defaultModel);
      }
    }
  }, [availableModels, model]);

  // Find configuration for the currently selected model
  const currentConfig = availableModels?.find((c: any) => c.availableModels.includes(model));

  // Update resolution if needed when model changes
  useEffect(() => {
    if (currentConfig && currentConfig.allowedResolutions && !currentConfig.allowedResolutions.includes(resolution)) {
      if (currentConfig.allowedResolutions.length > 0) {
        setResolution(currentConfig.allowedResolutions[0]);
      }
    }
  }, [currentConfig, resolution]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [prompt]);

  const handleGenerate = () => {
    console.log('=== GENERATE IMAGE START ===');
    console.log('Prompt:', prompt);
    console.log('Model:', model);
    console.log('Resolution:', resolution);
    console.log('Available Models:', availableModels);

    if (!prompt.trim() || isGenerating) {
      console.log('Generation blocked: empty prompt or already generating');
      return;
    }

    if (!model) {
      console.error('No model selected!');
      alert('Please select a model before generating');
      return;
    }
    
    // Find provider for the selected model
    let provider = "pollinations";
    if (availableModels) {
      const config = availableModels.find((c: any) => c.availableModels.includes(model));
      if (config) {
        provider = config.provider;
        console.log('Found provider:', provider);
      } else {
        console.error('Could not find provider for model:', model);
      }
    }

    const requestData = {
      prompt,
      negativePrompt,
      resolution,
      seed: seed === "" ? undefined : seed,
      provider,
      model
    };
    console.log('Request data:', requestData);

    generateImage(requestData, {
      onSuccess: (response: any) => {
        console.log('Generation success response:', response);
        if (response?.data?.data?.images) {
          console.log('Images received:', response.data.data.images);
          setGeneratedImages(response.data.data.images);
        } else {
          console.error('No images in response');
        }
      },
      onError: (error: any) => {
        console.error('Generation error:', error);
        console.error('Error response:', error?.response?.data);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-80 bg-background border-r border-border flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Liora</h1>
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
                <span className={quota.data.remaining === 0 ? "text-destructive" : "text-primary"}>
                  {quota.data.remaining}/{quota.data.limit}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(quota.data.remaining / quota.data.limit) * 100}%` }}
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
              <Select value={model} onValueChange={setModel} disabled={modelsLoading || !availableModels || availableModels.length === 0}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={modelsLoading ? "Loading models..." : "Select model"} />
                </SelectTrigger>
                <SelectContent>
                  {modelsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading models...
                    </SelectItem>
                  ) : availableModels && availableModels.length > 0 ? (
                    availableModels.flatMap((config: any) => 
                      config.availableModels.map((modelName: string) => (
                        <SelectItem key={`desktop-${config.provider}-${modelName}`} value={modelName}>
                          {config.provider === 'gemini' ? 'Google Gemini 2.5 (Paid)' : 
                           modelName === 'flux' ? 'Flux.1 Pro (Best Quality)' :
                           modelName === 'sdxl' ? 'SDXL Turbo (Fast)' : 
                           modelName}
                        </SelectItem>
                      ))
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
              <Select value={resolution} onValueChange={setResolution} disabled={!currentConfig}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  {currentConfig?.allowedResolutions?.map((res: string) => (
                    <SelectItem key={`desktop-res-${res}`} value={res}>
                      {res === "1024x1024" ? "1024×1024 (Square)" :
                       res === "1152x896" ? "1152×896 (Landscape)" :
                       res === "896x1152" ? "896×1152 (Portrait)" :
                       res === "1360x768" ? "1360×768 (Ultra Wide)" :
                       res}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">
                  Seed {seed === "" && "(Random)"}
                </Label>
                <Input
                  type="number"
                  placeholder="Random"
                  value={seed}
                  onChange={(e) =>
                    setSeed(e.target.value === "" ? "" : Number(e.target.value))
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

      {/* Mobile Sidebar - Full Screen Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-background border-r border-border overflow-y-auto lg:hidden">
            <div className="p-6 space-y-8">
              {/* Mobile Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h2 className="text-lg font-bold">Settings</h2>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Separator />

              {/* Mobile Settings */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-semibold">
                    <Settings className="w-4 h-4" /> Model
                  </Label>
                  <Select value={model} onValueChange={setModel} disabled={modelsLoading || !availableModels || availableModels.length === 0}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={modelsLoading ? "Loading models..." : "Select model"} />
                    </SelectTrigger>
                    <SelectContent>
                      {modelsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading models...
                        </SelectItem>
                      ) : availableModels && availableModels.length > 0 ? (
                        availableModels.flatMap((config: any) => 
                          config.availableModels.map((modelName: string) => (
                            <SelectItem key={`mobile-${config.provider}-${modelName}`} value={modelName}>
                              {config.provider === 'gemini' ? 'Google Gemini 2.5 (Paid)' : 
                               modelName === 'flux' ? 'Flux.1 Pro (Best Quality)' :
                               modelName === 'sdxl' ? 'SDXL Turbo (Fast)' : 
                               modelName}
                            </SelectItem>
                          ))
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
                  <Select value={resolution} onValueChange={setResolution} disabled={!currentConfig}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resolution" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentConfig?.allowedResolutions?.map((res: string) => (
                        <SelectItem key={`mobile-res-${res}`} value={res}>
                          {res === "1024x1024" ? "1024×1024 (Square)" :
                           res === "1152x896" ? "1152×896 (Landscape)" :
                           res === "896x1152" ? "896×1152 (Portrait)" :
                           res === "1360x768" ? "1360×768 (Ultra Wide)" :
                           res}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">
                      Seed {seed === "" && "(Random)"}
                    </Label>
                    <Input
                      type="number"
                      placeholder="Random"
                      value={seed}
                      onChange={(e) =>
                        setSeed(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Negative Prompt
                  </Label>
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
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-background border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-bold">Liora</h1>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <Badge variant="outline" className="text-xs">
                  {user.username}
                </Badge>
              )}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {generatedImages?.length > 0 ? (
              generatedImages.map((img, i) => (
                <Card
                  key={i}
                  className="group aspect-square bg-muted/50 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center hover:bg-muted/70 transition-all duration-300 relative overflow-hidden"
                >
                  <img 
                    src={img} 
                    alt={`Generated ${i + 1}`} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      console.error('Image load error for:', img);
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML += '<div class="flex flex-col items-center justify-center h-full"><div class="text-destructive text-sm mb-2">Image failed to load</div><div class="text-xs text-muted-foreground">External API issue</div></div>';
                      }
                    }}
                  />
                  
                  {/* Hover Actions */}
                  <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={() => window.open(img, '_blank')}>
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              // Empty State Placeholders
              <Card
                className="group aspect-square bg-muted/50 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center hover:bg-muted/70 transition-all duration-300 relative"
              >
                <ImageIcon className="w-12 h-12 text-muted-foreground/50 group-hover:text-primary transition-colors mb-3" />
                <p className="text-sm text-muted-foreground font-medium">
                  Generated Image
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Prompt Bar */}
        <div className="border-t border-border bg-background p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Describe the image you want to generate..."
                  className="min-h-12 max-h-32 resize-none pr-12 text-base border-2 focus:border-primary/50 rounded-lg"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating}
                />
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  {prompt.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {prompt.length}
                    </span>
                  )}
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Wand2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating || !model}
                className={cn(
                  "px-8 font-semibold h-12 min-w-32 transition-all duration-300",
                  "bg-primary hover:bg-primary/90",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                title={!model ? 'Please select a model first' : ''}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    {(() => {
                      if (!model) return "Generate";
                      
                      let costText = "";
                      if (currentConfig) {
                        const isPaid = !currentConfig.isFree || (quota && quota.data.remaining === 0);
                        if (isPaid && currentConfig.artcoinCostPerImage > 0) {
                          costText = ` (${currentConfig.artcoinCostPerImage} AC)`;
                        }
                      }
                      
                      return `Generate ${costText}`;
                    })()}
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Be descriptive for better results</span>
              <span>Enter to generate • Shift+Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Liora;
