import * as React from "react"

import { cn } from "@/lib/utils"
import { useColorPalette } from "@/contexts/color-palette-context"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, style, ...props }, ref) => {
  const { paletteData } = useColorPalette()
  
  return (
    <textarea
      className={cn(    
        "flex min-h-[80px] w-full rounded-md bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0",
        className
      )}
      style={{
        ...style,
        '--placeholder-color': paletteData.muted,
      } as React.CSSProperties & { '--placeholder-color': string }}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
