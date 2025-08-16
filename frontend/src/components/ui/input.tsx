import * as React from "react";
import { cn } from "../../libs/utils";

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "green-focus" | "search";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-9 w-full px-3 py-1 bg-transparent imge:bg-transparent text-base shadow-sm transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          
          // Variant styles
          variant === "default" && cn(
            "rounded-lg border dark:border-zinc-800",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          ),
          variant === "green-focus" && cn(
            "rounded-lg border dark:border-zinc-800",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-main-color focus-visible:border-main-color bg-transparent"
          ),
          variant === "search" && cn(
            "rounded-full border dark:border-zinc-700",
            "focus:border-main-color"
          ),
          
          // Custom class overrides
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
