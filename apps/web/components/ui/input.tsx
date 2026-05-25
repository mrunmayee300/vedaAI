import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-full border border-border bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-card",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
