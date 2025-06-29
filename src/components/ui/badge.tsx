import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useColorPalette } from "@/contexts/color-palette-context"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "hover:opacity-90",
        secondary:
          "hover:opacity-90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border border-border",
        
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const { paletteData } = useColorPalette()

  const defaultStyle = variant === "destructive" || variant === "outline" 
    ? {} 
    : {
        backgroundColor: paletteData.text,
        color: paletteData.background,
        ...style
      }

  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} 
      style={defaultStyle}
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
