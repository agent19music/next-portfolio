"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { colorPalettes, type ColorPaletteKey } from '@/components/color-palette-selector'

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

// Dark mode transformation function - swap background with primary and accents
function getDarkModeTransformation(paletteKey: ColorPaletteKey) {
  const originalPalette = colorPalettes[paletteKey]
  
  // Only swap background and text colors, keep accent colors (pills) the same
  return {
    name: originalPalette.name,
    background: originalPalette.text, // Use text color as background
    text: originalPalette.background, // Use background as text
    accent: originalPalette.accent, // Keep accent the same (for pills)
    primary: originalPalette.text, // Use text color as primary
    secondary: originalPalette.background, // Use background as secondary
    get muted() { return createMutedColor(originalPalette.background, true) }, // Lighter muted version for dark mode
    cardText: "#f8f8f8", // Off-white text for cards in dark mode
  }
}

interface ColorPaletteContextType {
  currentPalette: ColorPaletteKey
  setCurrentPalette: (palette: ColorPaletteKey) => void
  paletteData: any // Allow any palette data type (original or transformed)
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
}

const ColorPaletteContext = createContext<ColorPaletteContextType | undefined>(undefined)

export function ColorPaletteProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<ColorPaletteKey>("mocha")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Monitor system dark mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setIsDarkMode(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Load saved palette on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("color-palette")
      if (saved && saved in colorPalettes) {
        setCurrentPalette(saved as ColorPaletteKey)
      }
    }
  }, [])

  // Apply theme changes to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const palette = colorPalettes[currentPalette]
      
      // Use new dark mode transformation
      const appliedPalette = isDarkMode ? getDarkModeTransformation(currentPalette) : palette
      
      // Utility function to lighten a color for card backgrounds
      const lightenColor = (hex: string, amount: number = 0.05): string => {
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
      
      // Also set the body background to match the palette
      document.body.style.backgroundColor = appliedPalette.background
      document.body.style.color = appliedPalette.text
    }
  }, [currentPalette, isDarkMode])

  const palette = colorPalettes[currentPalette]
  
  // Use new dark mode transformation for paletteData
  const paletteData = isDarkMode ? getDarkModeTransformation(currentPalette) : palette

  return (
    <ColorPaletteContext.Provider 
      value={{ 
        currentPalette, 
        setCurrentPalette, 
        paletteData,
        isDarkMode,
        setIsDarkMode
      }}
    >
      {children}
    </ColorPaletteContext.Provider>
  )
}

export function useColorPalette() {
  const context = useContext(ColorPaletteContext)
  if (context === undefined) {
    throw new Error('useColorPalette must be used within a ColorPaletteProvider')
  }
  return context
} 