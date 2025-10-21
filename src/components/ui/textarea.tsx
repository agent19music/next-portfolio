import * as React from "react"

import { cn } from "@/lib/utils"
import { useColorPalette } from "@/contexts/color-palette-context"
import { ColorPaletteKey, colorPalettes } from "../color-palette-selector"

type TextareaColorScheme = "default" | "monochrome"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { colorScheme?: TextareaColorScheme }
>(({ className, style, colorScheme = "default", ...props }, ref) => {
  const { currentPalette, isDarkMode } = useColorPalette()
  const isMonochrome = colorScheme === "monochrome"
  
  function createMutedColor(hex: string, isDarkMode: boolean = false): string {
    const cleanHex = hex.replace('#', '')
    const num = parseInt(cleanHex, 16)
    
    const r = (num >> 16) & 255
    const g = (num >> 8) & 255
    const b = num & 255
    
    if (isDarkMode) {
      // In dark mode, make muted colors lighter/more visible
      const newR = Math.min(255, Math.round(r + (255 - r) * 0.4))
      const newG = Math.min(255, Math.round(g + (255 - g) * 0.4))
      const newB = Math.min(255, Math.round(b + (255 - b) * 0.4))
      return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`
    } else {
      // In light mode, make muted colors slightly lighter
      const newR = Math.min(255, Math.round(r + (255 - r) * 0.3))
      const newG = Math.min(255, Math.round(g + (255 - g) * 0.3))
      const newB = Math.min(255, Math.round(b + (255 - b) * 0.3))
      return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`
    }
  }
  
  function getDarkModeTransformation(paletteKey: string): {
    background: string;
    text: string;
    accent: string;
    primary: string;
    secondary: string;
    muted: string;
    cardText: string;
  } {
    const originalPalette = colorPalettes[paletteKey as ColorPaletteKey]
    
    // Only swap background and text colors, keep accent colors (pills) the same
    return {
      ...originalPalette,
      background: originalPalette.text, // Use text color as background
      text: originalPalette.background, // Use background as text
      accent: originalPalette.accent, // Keep accent the same (for pills)
      primary: originalPalette.text, // Use text color as primary
      secondary: originalPalette.background, // Use background as secondary
      muted: createMutedColor(originalPalette.background, true), // Lighter muted version for dark mode
      cardText: "#f8f8f8", // Off-white text for cards in dark mode
    }
  }
  
  const currentPaletteData = colorPalettes[currentPalette]
  const appliedPalette = isDarkMode ? getDarkModeTransformation(currentPalette) : currentPaletteData
  const monochromeColors = {
    background: "#18181b",
    text: "#f8f8f8",
    placeholder: "#b0b0b0",
  }
  const placeholderColor = isMonochrome ? monochromeColors.placeholder : appliedPalette.text
  
  // Generate a unique ID for this textarea instance
  const textareaId = React.useId()
  
  // Create dynamic CSS for placeholder styling
  React.useEffect(() => {
    const styleId = `textarea-placeholder-${textareaId}`
    let styleElement = document.getElementById(styleId) as HTMLStyleElement
    
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }
    
    styleElement.textContent = `
      .textarea-${textareaId}::placeholder {
        color: ${placeholderColor} !important;
        opacity: 0.7 !important;
      }
    `
    
    return () => {
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
    }
  }, [placeholderColor, textareaId])

  
  return (
    <textarea
      className={cn(    
        "flex min-h-[80px] w-full rounded-md bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0",
        `textarea-${textareaId}`,
        className
      )}
      style={{
        ...style,
        color: isMonochrome ? monochromeColors.text : appliedPalette.text,
        backgroundColor: isMonochrome ? monochromeColors.background : appliedPalette.background,
      }}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
