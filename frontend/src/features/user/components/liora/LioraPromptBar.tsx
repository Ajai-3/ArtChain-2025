import React, { useMemo } from "react";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Wand2, Loader2, Zap } from "lucide-react";
import { cn } from "../../../../libs/utils";

interface LioraPromptBarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  prompt: string;
  setPrompt: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
  model: string;
  cost: number;
  balance: number;
  isLimitReached: boolean;
  quotaLoading: boolean;
}

export const LioraPromptBar: React.FC<LioraPromptBarProps> = ({
  textareaRef,
  prompt,
  setPrompt,
  handleKeyDown,
  handleGenerate,
  isGenerating,
  model,
  cost,
  balance,
  isLimitReached,
  quotaLoading,
}) => {
  const canGenerate = useMemo(() => {
    if (isGenerating || !model || !prompt.trim() || quotaLoading) return false;
    
    // If there is a cost, user must have enough balance
    if (cost > 0 && balance < cost) return false;
    
    // If free (cost 0) but limit reached? 
    // Usually if cost is 0, it means we are using free quota. 
    // If limit is reached, cost should ideally be > 0 (paid fallback) OR user is blocked.
    // If logic determines Cost is 0, then we allow it.
    // However, if Cost is 0 AND Limit Reached -> It means NO fallback exists, so block.
    if (cost === 0 && isLimitReached) return false;

    return true;
  }, [isGenerating, model, prompt, quotaLoading, cost, balance, isLimitReached]);

  const buttonText = useMemo(() => {
    if (isGenerating) return "Generating...";
    if (quotaLoading) return "Checking...";
    if (cost === 0 && isLimitReached) return "Daily Limit Reached";
    if (cost > 0 && balance < cost) return "Insufficient ArtCoins";
    if (cost > 0) return `Generate (${cost} AC)`;
    return "Generate (Free)";
  }, [isGenerating, quotaLoading, cost, isLimitReached, balance]);

  return (
    <div className="border-t border-border bg-background p-4 shadow-t-lg z-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder="Describe the image you want to generate..."
              className="min-h-[3rem] max-h-32 resize-none pr-12 text-base border-2 focus:border-primary/50 rounded-lg shadow-sm"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
            />
            <div className="absolute right-3 top-3">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground hover:text-primary"
              >
                <Wand2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={cn(
              "px-8 font-semibold h-auto min-w-32 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5",
              "bg-gradient-to-r from-primary to-purple-600 hover:opacity-90",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2 fill-current" />
                {buttonText}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
