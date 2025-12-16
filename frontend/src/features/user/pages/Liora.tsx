import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { Sparkles, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useGenerateAIImage } from "../hooks/ai/useGenerateAIImage";
import { useCheckAIQuota } from "../hooks/ai/useCheckAIQuota";
import { useGetAvailableModels } from "../hooks/ai/useGetAvailableModels";
import { useGetMyAIGenerations } from "../hooks/ai/useGetMyAIGenerations";
import { useDeleteAIGeneration } from "../hooks/ai/useDeleteAIGeneration";
import { useQueryClient } from "@tanstack/react-query";
import type { AIGeneratedImage } from "../../../types/ai";
import { LioraSidebar } from "../components/liora/LioraSidebar";
import { LioraImageGrid } from "../components/liora/LioraImageGrid";
import { LioraPromptBar } from "../components/liora/LioraPromptBar";
import { LioraDetailModal } from "../components/liora/LioraDetailModal";
import { DeleteGenerationModal } from "../components/liora/DeleteGenerationModal";

const Liora: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState("");
  const [resolution, setResolution] = useState("1024x1024");
  const [seed, setSeed] = useState<number | "">("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<AIGeneratedImage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const queryClient = useQueryClient();

  const { mutate: generateImage, isPending: isGenerating } = useGenerateAIImage();
  const { data: availableModels, isLoading: modelsLoading } = useGetAvailableModels();
  const { data: quota, isLoading: quotaLoading } = useCheckAIQuota();
  const { data: historyData, isLoading: historyLoading } = useGetMyAIGenerations(1, 50); // Fetch recent 50 generations
  const { mutate: deleteGeneration, isPending: isDeleting } = useDeleteAIGeneration();
  const walletData = useSelector((state: RootState) => state.wallet);

  // Cost Calculation Logic
  const isLimitReached = useMemo(() => {
    return quota?.data?.remaining === 0;
  }, [quota]);

  const currentCost = useMemo(() => {
    if (!model || !availableModels) return 0;
    
    // Find model config
    const config = availableModels.find((c: any) => c.availableModels.includes(model));
    const provider = config?.provider || "pollinations";

    // If Free Tier available and Limit NOT reached -> Free
    if (provider === "pollinations" || provider === "sdxl" || model === "sdxl" || model === "flux") {
       if (!isLimitReached) return 0;
    }

    // Get cost from config if available
    if (config?.artcoinCostPerImage !== undefined) {
      return config.artcoinCostPerImage;
    }
    
    // Fallback default
    return 5; 
  }, [model, availableModels, isLimitReached]);

  useEffect(() => {
    if (availableModels && availableModels.length > 0 && !model) {
      const firstConfig = availableModels[0];
      const defaultModel = firstConfig.defaultModel || firstConfig.availableModels[0];
      if (defaultModel) {
        setModel(defaultModel);
      }
    }
  }, [availableModels, model]);

  const currentConfig = availableModels?.find((c: any) => c.availableModels.includes(model));

  useEffect(() => {
    if (currentConfig && currentConfig.allowedResolutions && !currentConfig.allowedResolutions.includes(resolution)) {
      if (currentConfig.allowedResolutions.length > 0) {
        setResolution(currentConfig.allowedResolutions[0]);
      }
    }
  }, [currentConfig, resolution]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [prompt]);

  // Flatten logic to handle multiple images per generation
  const allImages = useMemo(() => {
    if (!historyData?.data?.generations) return [];
    
    // Map generations to a flat list of images
    return historyData.data.generations.flatMap((gen: any) => 
      gen.images.map((url: string) => ({
        id: gen.id,
        url,
        prompt: gen.prompt,
        model: gen.aiModel,
        createdAt: gen.createdAt
      }))
    );
  }, [historyData]);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    if (!model) {
      alert('Please select a model before generating');
      return;
    }

    // Validation
    if (currentCost > 0) {
      const balance = walletData?.balance || 0;
      if (balance < currentCost) {
        alert(`Insufficient ArtCoins. You need ${currentCost} AC but have ${balance} AC.`);
        return;
      }
    }
    
    // Strict Limit Check for Free Generations
    if (currentCost === 0 && isLimitReached) {
        alert("Daily limit reached for free generations. Please try a paid model or wait for reset.");
        return;
    }
    
    let provider = "pollinations";
    if (availableModels) {
      const config = availableModels.find((c: any) => c.availableModels.includes(model));
      if (config) provider = config.provider;
    }

    const requestData = {
      prompt,
      negativePrompt,
      resolution,
      seed: seed === "" ? undefined : seed,
      provider,
      model
    };

    generateImage(requestData, {
      onSuccess: () => {
        // Refresh Quota and History immediately
        queryClient.invalidateQueries({ queryKey: ["ai-quota"] });
        queryClient.invalidateQueries({ queryKey: ["my-ai-generations"] });
      },
      onError: (error: any) => {
        console.error('Generation error:', error);
      }
    });
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteGeneration(deleteId);
      if (selectedImage?.id === deleteId) setSelectedImage(null);
      setDeleteId(null);
    }
  };

  const handleDownload = async (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `liora-gen-${Date.now()}.png`; // Better filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback
      window.open(url, '_blank');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex h-full">
      <LioraSidebar
        user={user}
        quota={quota}
        model={model}
        setModel={setModel}
        modelsLoading={modelsLoading}
        availableModels={availableModels}
        resolution={resolution}
        setResolution={setResolution}
        currentConfig={currentConfig}
        seed={seed}
        setSeed={setSeed}
        negativePrompt={negativePrompt}
        setNegativePrompt={setNegativePrompt}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Mobile Header */}
        <div className="lg:hidden bg-background border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-bold">Liora</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <LioraImageGrid
          isGenerating={isGenerating}
          model={model}
          allImages={allImages}
          historyLoading={historyLoading}
          setSelectedImage={setSelectedImage}
          handleDownload={handleDownload}
          handleDeleteClick={handleDeleteClick}
          isDeleting={isDeleting}
        />

        <LioraPromptBar
          textareaRef={textareaRef}
          prompt={prompt}
          setPrompt={setPrompt}
          handleKeyDown={handleKeyDown}
          handleGenerate={handleGenerate}
          isGenerating={isGenerating}
          model={model}
          cost={currentCost}
          balance={walletData?.balance || 0}
          isLimitReached={isLimitReached}
          quotaLoading={quotaLoading}
        />
      </div>
      
      <LioraDetailModal
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        handleDownload={handleDownload}
        handleDeleteClick={handleDeleteClick}
        isDeleting={isDeleting}
      />

      <DeleteGenerationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Liora;
