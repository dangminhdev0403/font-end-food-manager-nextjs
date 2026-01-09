import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex  items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-sm hover:shadow-md hover:shadow-primary/30 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80 dark:hover:shadow-primary/20",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 active:scale-95 shadow-sm hover:shadow-md hover:shadow-destructive/30 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/80 dark:hover:bg-destructive/70 dark:text-destructive-foreground dark:hover:shadow-destructive/20",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-background dark:border-input dark:hover:bg-input/50 dark:hover:text-accent-foreground active:scale-95 hover:border-primary/50 dark:hover:border-primary/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 shadow-sm hover:shadow-md hover:shadow-secondary/30 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/70 dark:hover:shadow-secondary/20",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/40 dark:text-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline active:scale-95 dark:text-primary dark:hover:text-primary/80",
        success:
          "bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-sm hover:shadow-md hover:shadow-green-600/30 dark:bg-green-900/50 dark:border dark:border-green-700 dark:hover:bg-green-800 dark:text-green-200 dark:hover:shadow-green-900/30",
        warning:
          "bg-amber-500 text-white hover:bg-amber-600 active:scale-95 shadow-sm hover:shadow-md hover:shadow-amber-500/30 dark:bg-amber-900/50 dark:border dark:border-amber-700 dark:hover:bg-amber-800 dark:text-amber-200 dark:hover:shadow-amber-900/30",
        info: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow-md hover:shadow-blue-600/30 dark:bg-blue-900/50 dark:border dark:border-blue-700 dark:hover:bg-blue-800 dark:text-blue-200 dark:hover:shadow-blue-900/30",
        gradient:
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 active:scale-95 shadow-md hover:shadow-lg hover:shadow-purple-600/30 dark:from-purple-800 dark:to-pink-800 dark:hover:from-purple-900 dark:hover:to-pink-900 dark:hover:shadow-purple-900/20",
        soft: "bg-accent text-accent-foreground hover:bg-accent/80 active:scale-95 dark:bg-input dark:text-foreground dark:hover:bg-input/70",
        glow: "relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-blue-500/30 active:scale-95 animate-glow-pulse",
        shimmer:
          "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 text-slate-900 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 dark:text-white animate-shimmer shadow-sm hover:shadow-md active:scale-95",
        neon: "bg-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 border-2 border-cyan-400 hover:border-blue-500 dark:bg-white dark:text-transparent active:scale-95 hover:shadow-lg hover:shadow-cyan-500/50",
        food: "bg-amber-700/20 border border-amber-600/40 text-amber-100 hover:bg-amber-600 hover:text-black hover:border-amber-500",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 text-base",
        xl: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base font-semibold",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      iconPosition = "left",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
