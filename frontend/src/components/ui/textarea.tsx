import * as React from "react";
import { cn } from "../../libs/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  variant?: "default" | "green-focus";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseStyles = "flex min-h-[60px] w-full px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
    
    const variantStyles = {
      default: "rounded-md border border-input bg-transparent focus-visible:ring-1 focus-visible:ring-ring",
      "green-focus": "rounded-lg border dark:border-zinc-800 bg-transparent focus-visible:ring-1 focus-visible:ring-main-color focus-visible:border-main-color"
    };

    return (
      <textarea
        className={cn(
          baseStyles,
          variantStyles[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };