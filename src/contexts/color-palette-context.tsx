"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { colorPalettes, type ColorPaletteKey } from '@/components/color-palette-selector'

// Utility function for simple dark mode color swapping
function getContrastColor(hex: string, isDark: boolean): string {
  if (!isDark) return hex
  
  const cleanHex = hex.replace('#', '')
  const num = parseInt(cleanHex, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  
  // Calculate luminance to determine if it's light or dark
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Simple inversion: light colors become dark, dark colors become light
  if (luminance > 0.5) {
    // Light color - make it dark
    return '#2a2a2a'
  } else {
    // Dark color - make it light
    return '#f5f5f5'
  }
}



interface ColorPaletteContextType {
  currentPalette: ColorPaletteKey
  setCurrentPalette: (palette: ColorPaletteKey) => void
  paletteData: typeof colorPalettes[ColorPaletteKey]
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
      
      // Simple dark mode: just swap background and text colors
      const appliedPalette = isDarkMode ? {
        ...palette,
        background: getContrastColor(palette.background, true),
        text: getContrastColor(palette.text, true),
        primary: getContrastColor(palette.background, true),
        accent: getContrastColor(palette.accent, true),
        secondary: getContrastColor(palette.secondary, true),
      } : palette
      
      // Set CSS custom properties
      document.documentElement.style.setProperty('--background', appliedPalette.background)
      document.documentElement.style.setProperty('--text', appliedPalette.text)
      document.documentElement.style.setProperty('--accent', appliedPalette.accent)
      document.documentElement.style.setProperty('--primary', appliedPalette.primary)
      document.documentElement.style.setProperty('--secondary', appliedPalette.secondary)
      document.documentElement.style.setProperty('--muted', appliedPalette.muted)
      
      // Also set the body background to match the palette
      document.body.style.backgroundColor = appliedPalette.background
      document.body.style.color = appliedPalette.text
    }
  }, [currentPalette, isDarkMode])

  const palette = colorPalettes[currentPalette]
  
  // Simple dark mode transformation for paletteData
  const paletteData = isDarkMode ? {
    ...palette,
    background: getContrastColor(palette.background, true),
    text: getContrastColor(palette.text, true),
    primary: getContrastColor(palette.background, true),
    accent: getContrastColor(palette.accent, true),
    secondary: getContrastColor(palette.secondary, true),
  } : palette

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