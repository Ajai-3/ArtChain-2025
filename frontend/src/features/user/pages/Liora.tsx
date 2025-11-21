import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { Badge } from "../../../components/ui/badge";
import { Slider } from "../../../components/ui/slider";
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
  Menu,
  X,
} from "lucide-react";
import { cn } from "../../../libs/utils";

const Liora: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState("flux");
  const [resolution, setResolution] = useState("1024x1024");
  const [imageCount, setImageCount] = useState(4);
  const [seed, setSeed] = useState<number | "">("");
  const [guidance, setGuidance] = useState([7.5]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useSelector((state: RootState) => state.user.user);

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
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
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

          {/* Settings */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Settings className="w-4 h-4" /> Model
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flux">
                    Flux.1 Pro (Best Quality)
                  </SelectItem>
                  <SelectItem value="sdxl">SDXL Turbo (Fast)</SelectItem>
                  <SelectItem value="dreamshaper">DreamShaper v8</SelectItem>
                  <SelectItem value="realistic">Realistic Vision v5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Settings className="w-4 h-4" /> Resolution
              </Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">1024×1024 (Square)</SelectItem>
                  <SelectItem value="1152x896">1152×896 (Landscape)</SelectItem>
                  <SelectItem value="896x1152">896×1152 (Portrait)</SelectItem>
                  <SelectItem value="1360x768">
                    1360×768 (Ultra Wide)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Images</Label>
                <Input
                  type="number"
                  min={1}
                  max={8}
                  value={imageCount}
                  onChange={(e) =>
                    setImageCount(
                      Math.min(8, Math.max(1, Number(e.target.value) || 1))
                    )
                  }
                  className="text-center font-medium"
                />
              </div>
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
              <div className="flex justify-between">
                <Label className="text-sm font-semibold">Guidance Scale</Label>
                <span className="text-sm font-bold text-primary">
                  {guidance}
                </span>
              </div>
              <Slider
                value={guidance}
                onValueChange={setGuidance}
                min={1}
                max={20}
                step={0.5}
                className="cursor-pointer"
              />
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
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flux">
                        Flux.1 Pro (Best Quality)
                      </SelectItem>
                      <SelectItem value="sdxl">SDXL Turbo (Fast)</SelectItem>
                      <SelectItem value="dreamshaper">
                        DreamShaper v8
                      </SelectItem>
                      <SelectItem value="realistic">
                        Realistic Vision v5
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-semibold">
                    <Settings className="w-4 h-4" /> Resolution
                  </Label>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024x1024">
                        1024×1024 (Square)
                      </SelectItem>
                      <SelectItem value="1152x896">
                        1152×896 (Landscape)
                      </SelectItem>
                      <SelectItem value="896x1152">
                        896×1152 (Portrait)
                      </SelectItem>
                      <SelectItem value="1360x768">
                        1360×768 (Ultra Wide)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Images</Label>
                    <Input
                      type="number"
                      min={1}
                      max={8}
                      value={imageCount}
                      onChange={(e) =>
                        setImageCount(
                          Math.min(8, Math.max(1, Number(e.target.value) || 1))
                        )
                      }
                      className="text-center font-medium"
                    />
                  </div>
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
                  <div className="flex justify-between">
                    <Label className="text-sm font-semibold">
                      Guidance Scale
                    </Label>
                    <span className="text-sm font-bold text-primary">
                      {guidance}
                    </span>
                  </div>
                  <Slider
                    value={guidance}
                    onValueChange={setGuidance}
                    min={1}
                    max={20}
                    step={0.5}
                    className="cursor-pointer"
                  />
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
            {[...Array(imageCount)].map((_, i) => (
              <Card
                key={i}
                className="group aspect-square bg-muted/50 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center hover:bg-muted/70 transition-all duration-300 relative"
              >
                <ImageIcon className="w-12 h-12 text-muted-foreground/50 group-hover:text-primary transition-colors mb-3" />
                <p className="text-sm text-muted-foreground font-medium">
                  Image {i + 1}
                </p>

                {/* Hover Actions */}
                <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
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
                disabled={!prompt.trim() || isGenerating}
                className={cn(
                  "px-8 font-semibold h-12 min-w-32 transition-all duration-300",
                  "bg-primary hover:bg-primary/90",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate
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
