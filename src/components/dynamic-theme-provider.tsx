"use client"

import { useColorPalette } from "@/contexts/color-palette-context"
import { colorPalettes } from "@/components/color-palette-selector"
import { useEffect } from "react"

// Utility function to ensure proper contrast in dark mode
function getContrastColor(hex: string, isDark: boolean): string {
  if (!isDark) return hex
  
  const cleanHex = hex.replace('#', '')
  const num = parseInt(cleanHex, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // If the color is too dark in dark mode, lighten it
  if (luminance < 0.5) {
    const factor = 0.7
    const newR = Math.min(255, Math.round(r + (255 - r) * factor))
    const newG = Math.min(255, Math.round(g + (255 - g) * factor))
    const newB = Math.min(255, Math.round(b + (255 - b) * factor))
    return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`
  }
  
  return hex
}

interface DynamicThemeProviderProps {
  children: React.ReactNode
  isDarkMode?: boolean
}

export function DynamicThemeProvider({ children, isDarkMode = false }: DynamicThemeProviderProps) {
  const { currentPalette } = useColorPalette()
  
  useEffect(() => {
    const palette = colorPalettes[currentPalette]
    
    // Apply dark mode transformations if needed
    const appliedPalette = isDarkMode ? {
      ...palette,
      background: getContrastColor(palette.text, true),
      text: getContrastColor(palette.background, true),
      primary: getContrastColor(palette.text, true),
      accent: getContrastColor(palette.accent, true),
    } : palette
    
    // Set CSS custom properties
    document.documentElement.style.setProperty('--background', appliedPalette.background)
    document.documentElement.style.setProperty('--text', appliedPalette.text)
    document.documentElement.style.setProperty('--accent', appliedPalette.accent)
    document.documentElement.style.setProperty('--primary', appliedPalette.primary)
    document.documentElement.style.setProperty('--secondary', appliedPalette.secondary)
    document.documentElement.style.setProperty('--muted', appliedPalette.muted)
  }, [currentPalette, isDarkMode])

  return <>{children}</>
} 