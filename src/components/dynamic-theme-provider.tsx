"use client"

import { useColorPalette } from "@/contexts/color-palette-context"
import { colorPalettes, type ColorPaletteKey } from "@/components/color-palette-selector"
import { useEffect } from "react"

// Utility function to create a muted version of a color
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

// Utility function to lighten a color for card backgrounds
function lightenColor(hex: string, amount: number = 0.05): string {
  const cleanHex = hex.replace('#', '')
  const num = parseInt(cleanHex, 16)
  
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  
  const newR = Math.min(255, Math.round(r + (255 - r) * amount))
  const newG = Math.min(255, Math.round(g + (255 - g) * amount))
  const newB = Math.min(255, Math.round(b + (255 - b) * amount))
  
  return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`
}

// Dark mode transformation function - swap background with primary and accents
function getDarkModeTransformation(paletteKey: ColorPaletteKey) {
  const originalPalette = colorPalettes[paletteKey]
  
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

interface DynamicThemeProviderProps {
  children: React.ReactNode
  isDarkMode?: boolean
}

export function DynamicThemeProvider({ children, isDarkMode = false }: DynamicThemeProviderProps) {
  const { currentPalette } = useColorPalette()
  
  useEffect(() => {
    const palette = colorPalettes[currentPalette]
    
    // Use new dark mode transformation
    const appliedPalette = isDarkMode ? getDarkModeTransformation(currentPalette) : palette
    
    // Set CSS custom properties
    document.documentElement.style.setProperty('--background', appliedPalette.background)
    document.documentElement.style.setProperty('--text', appliedPalette.text)
    document.documentElement.style.setProperty('--accent', appliedPalette.accent)
    document.documentElement.style.setProperty('--primary', appliedPalette.primary)
    document.documentElement.style.setProperty('--secondary', appliedPalette.secondary)
    document.documentElement.style.setProperty('--muted', appliedPalette.muted)
    
    // Add lighter card background
    document.documentElement.style.setProperty('--card-bg', lightenColor(appliedPalette.background, 0.05))
    
    // Set card text color (off-white for dark mode, dark for light mode)
    document.documentElement.style.setProperty('--card-text', appliedPalette.cardText || (isDarkMode ? '#f8f8f8' : '#333333'))
  }, [currentPalette, isDarkMode])

  return <>{children}</>
} 