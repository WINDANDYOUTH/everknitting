import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const rainbowButtonVariants = cva(
  [
    "relative cursor-pointer group transition-all",
    "inline-flex items-center justify-center gap-2 shrink-0",
    "rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "text-sm font-medium whitespace-nowrap tracking-tight",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          // Base structure
          "border-0 bg-primary text-primary-foreground",
          "[border:calc(0.125rem)_solid_transparent]",
          // Animated gradient border using grayscale shimmer
          "bg-[linear-gradient(var(--primary),var(--primary)),linear-gradient(var(--primary)_50%,transparent_80%,transparent),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]",
          "bg-[length:200%]",
          "[background-clip:padding-box,border-box,border-box]",
          "[background-origin:border-box]",
          "animate-rainbow",
          // Subtle glow effect
          "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0",
          "before:h-1/5 before:w-3/5 before:-translate-x-1/2",
          "before:animate-rainbow before:opacity-50",
          "before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]",
          "before:bg-[length:200%]",
          "before:[filter:blur(0.75rem)]",
          // Hover state
          "hover:opacity-90 transition-opacity",
        ].join(" "),
        outline: [
          // Base structure with transparent background
          "border border-input bg-background text-foreground",
          // Animated gradient border
          "bg-[linear-gradient(var(--background),var(--background)),linear-gradient(var(--background)_50%,transparent_80%,transparent),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]",
          "bg-[length:200%]",
          "[background-clip:padding-box,border-box,border-box]",
          "[background-origin:border-box]",
          "animate-rainbow",
          // Subtle glow effect
          "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0",
          "before:h-1/5 before:w-3/5 before:-translate-x-1/2",
          "before:animate-rainbow before:opacity-30",
          "before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]",
          "before:bg-[length:200%]",
          "before:[filter:blur(0.75rem)]",
          // Hover state
          "hover:bg-accent transition-colors",
        ].join(" "),
        // Minimal variant without animation for reduced motion preference
        minimal: [
          "bg-primary text-primary-foreground",
          "hover:opacity-90 transition-opacity",
          "border-0",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-sm px-3 text-xs",
        lg: "h-11 rounded-sm px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rainbowButtonVariants> {
  asChild?: boolean
}

const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        data-slot="button"
        className={cn(rainbowButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

RainbowButton.displayName = "RainbowButton"

export { RainbowButton, rainbowButtonVariants, type RainbowButtonProps }
