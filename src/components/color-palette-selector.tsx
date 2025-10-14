"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Save, FileText, Sun, Moon, Settings, ExternalLink } from "lucide-react"
import { useColorPalette } from "@/contexts/color-palette-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Custom hook for modern media queries
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Custom hook for debounced save
function useDebouncedSave(delay: number = 3000) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  const debouncedSave = useCallback(async (currentPalette: ColorPaletteKey, isDarkMode: boolean) => {
    // Save to localStorage immediately for instant feedback
    localStorage.setItem("color-palette", currentPalette)
    
    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    
    setIsSaving(true)
    
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch('/api/save-preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            palette: currentPalette,
            isDarkMode
          })
        });
        
        if (!response.ok) {
          throw new Error('Save failed');
        }
        
        const result = await response.json();
        console.log('Save success:', result);
      } catch (error) {
        console.error('Save error:', error);
      } finally {
        setIsSaving(false);
      }
    }, delay);
    
    setSaveTimeout(timeout)
  }, [delay, saveTimeout])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
    }
  }, [saveTimeout])

  return { debouncedSave, isSaving }
}

// Utility function to lighten a color for card backgrounds
function lightenColor(hex: string, amount: number = 0.1): string {
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

// Color palette definitions with dynamic muted colors
export const colorPalettes = {
  "murder": {
    name: "Murder",
    background: "#FCF7F8", // snow
    text: "#A31621", // madder
    accent: "#A31621", // madder
    primary: "#FCF7F8", // snow
    secondary: "#A31621", // madder
    get muted() { return createMutedColor(this.text, false) }, // muted version of text
    cardText: "#333333", // Default card text for light mode
  },
  "monochrome": {
    name: "Monochrome",
    background: "#FFFFFF", // white
    text: "#000000", // black
    accent: "#000000", // black
    primary: "#FFFFFF", // white
    secondary: "#000000", // black
    get muted() { return createMutedColor(this.text, false) }, // muted version of text
    cardText: "#333333", // Default card text for light mode
  },
  "sunset": {
    name: "Sunset",
    background: "#FDF1F5", // petal
    text: "#EE8E46", // sunset
    accent: "#EE8E46", // sunset
    primary: "#FDF1F5", // petal
    secondary: "#EE8E46", // sunset
    get muted() { return createMutedColor(this.text, false) }, // muted version of text
    cardText: "#333333", // Default card text for light mode
  },
  "calm": {
    name: "Calm",
    background: "#F2F0E6", // alabaster
    text: "#7E8C54", // mossgreen
    accent: "#7E8C54", // mossgreen
    primary: "#F2F0E6", // alabaster
    secondary: "#7E8C54", // mossgreen
    get muted() { return createMutedColor(this.text, false) }, // muted version of text
    cardText: "#333333", // Default card text for light mode
  },
  "lilac": {
    name: "Lilac",
    background: "#F0EAD6", // eggshell
    text: "#C8A2C8", // lilac
    accent: "#C8A2C8", // lilac
    primary: "#F0EAD6", // eggshell
    secondary: "#C8A2C8", // lilac
    get muted() { return createMutedColor(this.text, false) }, // muted version of text
    cardText: "#333333", // Default card text for light mode
  },
  "mocha": {
    name: "Mocha",
    background: "#FDF1F5", // petal
    text: "#92736C", // mocha
    accent: "#92736C", // mocha
    primary: "#FDF1F5", // petal
    secondary: "#92736C", // mocha
    get muted() { return createMutedColor(this.text, false) }, // muted version of text
    cardText: "#333333", // Default card text for light mode
  },
} as const

export type ColorPaletteKey = keyof typeof colorPalettes

interface ColorPaletteSelectorProps {
  onPaletteChange: (palette: ColorPaletteKey) => void
  currentPalette: ColorPaletteKey
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

export function ColorPaletteSelector({ onPaletteChange, currentPalette }: ColorPaletteSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [savedPalette, setSavedPalette] = useState<ColorPaletteKey>("murder")
  const [showCV, setShowCV] = useState(false)
  const [isCVHovered, setIsCVHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const router = useRouter()
  
  // Modern media query hook
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // Use context for dark mode state
  const { isDarkMode, setIsDarkMode } = useColorPalette()
  
  // Custom debounced save hook
  const { debouncedSave, isSaving } = useDebouncedSave(3000)

  // Memoize palette calculations for performance
  const appliedPalette = useMemo(() => {
    return isDarkMode ? getDarkModeTransformation(currentPalette) : colorPalettes[currentPalette]
  }, [currentPalette, isDarkMode])

  // Load saved palette on mount with error handling
  useEffect(() => {
    try {
      const saved = localStorage.getItem("color-palette")
      if (saved && saved in colorPalettes) {
        setSavedPalette(saved as ColorPaletteKey)
        onPaletteChange(saved as ColorPaletteKey)
      }
    } catch (error) {
      console.warn('Failed to load saved palette:', error)
    }
  }, [onPaletteChange])

  const handlePaletteSelect = useCallback((palette: ColorPaletteKey) => {
    onPaletteChange(palette)
    setIsCollapsed(true)
    setIsOpen(false)
    setIsMobileMenuOpen(false)
  }, [onPaletteChange])

  const handleSave = useCallback(() => {
    setSavedPalette(currentPalette)
    setIsCollapsed(true)
    setIsOpen(false)
    setIsMobileMenuOpen(false)
    
    // Use debounced save
    debouncedSave(currentPalette, isDarkMode)
  }, [currentPalette, isDarkMode, debouncedSave])

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode)
  }, [isDarkMode, setIsDarkMode])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }, [isMobileMenuOpen])

  // Handle CV link opening in new tab
  const handleCVClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open("https://www.self.so/sean-nyandusi", '_blank', 'noopener,noreferrer')
  }, [])

  // Mobile view (smaller screens)
  if (isMobile) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Mobile Floating CTA */}
        <div className="relative">
          {/* Expanded Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute bottom-14 right-0 flex flex-col gap-2"
              >
                {/* CV Dialog */}
                <Dialog open={showCV} onOpenChange={setShowCV}>
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                      }}
                      onMouseEnter={() => setIsCVHovered(true)}
                      onMouseLeave={() => setIsCVHovered(false)}
                      onClick={handleCVClick}
                    >
                      {isCVHovered ? (
                        <ExternalLink className="w-4 h-4" style={{ color: appliedPalette.text }}  target="_blank" href="https://www.self.so/sean-nyandusi"/>
                      ) : (
                        <FileText className="w-4 h-4" style={{ color: appliedPalette.text }} />
                      )}
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent 
                    className="sm:max-w-4xl border-0 p-0 overflow-hidden max-h-[90vh]"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(40px) saturate(200%)",
                      WebkitBackdropFilter: "blur(40px) saturate(200%)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                    }}
                  >
                    <Suspense fallback={<div className="flex items-center justify-center h-96">Loading...</div>}>
                      <CVViewer />
                    </Suspense>
                  </DialogContent>
                </Dialog>

                {/* Dark Mode Toggle */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                  }}
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4" style={{ color: appliedPalette.text }} />
                  ) : (
                    <Moon className="w-4 h-4" style={{ color: appliedPalette.text }} />
                  )}
                </motion.div>

                {/* Color Palette Selector */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-full shadow-lg cursor-pointer"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                      }}
                    >
                      <div className="flex gap-0.5">
                        <div 
                          className="w-2 h-2 rounded-full shadow-sm" 
                          style={{ backgroundColor: appliedPalette.text }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full shadow-sm" 
                          style={{ backgroundColor: appliedPalette.background }}
                        />
                      </div>
                      <span 
                        className="text-xs font-medium backdrop-blur-sm"
                        style={{ color: appliedPalette.text }}
                      >
                        {colorPalettes[currentPalette].name}
                      </span>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent 
                    className="sm:max-w-md border-0 p-0 overflow-hidden"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(40px) saturate(200%)",
                      WebkitBackdropFilter: "blur(40px) saturate(200%)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                    }}
                  >
                    <ColorPaletteDialog 
                      currentPalette={currentPalette}
                      onPaletteSelect={handlePaletteSelect}
                      onSave={handleSave}
                      isDarkMode={isDarkMode}
                    />
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main CTA Button - Clean settings icon without complex styling */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            style={{
              background: isDarkMode 
                ? "rgba(255, 255, 255, 0.1)" 
                : "rgba(0, 0, 0, 0.05)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
            }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Settings 
                className="w-5 h-5" 
                style={{ 
                  color: isDarkMode ? '#f8f8f8' : '#374151'
                }} 
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Desktop view (unchanged but with updated icons)
  if (isCollapsed) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {/* CV Dialog */}
        <Dialog open={showCV} onOpenChange={setShowCV}>
          <DialogTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
              style={{
                background: isDarkMode 
                  ? "rgba(255, 255, 255, 0.1)" 
                  : "rgba(0, 0, 0, 0.05)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              }}
              onMouseEnter={() => setIsCVHovered(true)}
              onMouseLeave={() => setIsCVHovered(false)}
              onClick={handleCVClick}
            >
              {isCVHovered ? (
                <ExternalLink className="w-5 h-5" style={{ color: isDarkMode ? '#f8f8f8' : '#374151' }} />
              ) : (
                <FileText className="w-5 h-5" style={{ color: isDarkMode ? '#f8f8f8' : '#374151' }} />
              )}
            </motion.div>
          </DialogTrigger>
          <DialogContent 
            className="sm:max-w-4xl border-0 p-0 overflow-hidden max-h-[90vh]"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(40px) saturate(200%)",
              WebkitBackdropFilter: "blur(40px) saturate(200%)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
            }}
          >
            <Suspense fallback={<div className="flex items-center justify-center h-96">Loading...</div>}>
              <CVViewer />
            </Suspense>
          </DialogContent>
        </Dialog>

        {/* Dark Mode Toggle */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
          style={{
            background: isDarkMode 
              ? "rgba(255, 255, 255, 0.1)" 
              : "rgba(0, 0, 0, 0.05)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
          }}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" style={{ color: isDarkMode ? '#f8f8f8' : '#374151' }} />
          ) : (
            <Moon className="w-5 h-5" style={{ color: isDarkMode ? '#f8f8f8' : '#374151' }} />
          )}
        </motion.div>

        {/* Color Palette Selector */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg cursor-pointer"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                }}
              >
                <div className="flex gap-1">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: appliedPalette.background }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: appliedPalette.text }}
                  />
                </div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: appliedPalette.text }}
                >
                  {colorPalettes[currentPalette].name}
                </span>
              </motion.div>
            </DialogTrigger>
            <DialogContent 
              className="sm:max-w-md border-0 p-0 overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(40px) saturate(200%)",
                WebkitBackdropFilter: "blur(40px) saturate(200%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              }}
            >
              <ColorPaletteDialog 
                currentPalette={currentPalette}
                onPaletteSelect={handlePaletteSelect}
                onSave={handleSave}
                isDarkMode={isDarkMode}
                isSaving={isSaving}
              />
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {/* CV Dialog */}
      <Dialog open={showCV} onOpenChange={setShowCV}>
        <DialogTrigger asChild>
          <motion.div
            className="w-16 h-16 rounded-full cursor-pointer shadow-lg flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ 
              background: isDarkMode 
                ? "rgba(255, 255, 255, 0.1)" 
                : "rgba(0, 0, 0, 0.05)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setIsCVHovered(true)}
            onMouseLeave={() => setIsCVHovered(false)}
            onClick={handleCVClick}
          >
            {isCVHovered ? (
              <ExternalLink className="w-6 h-6" style={{ color: isDarkMode ? '#f8f8f8' : '#374151' }} />
            ) : (
              <FileText className="w-6 h-6" style={{ color: isDarkMode ? '#f8f8f8' : '#374151' }} />
            )}
          </motion.div>
        </DialogTrigger>
        <DialogContent 
          className="sm:max-w-4xl border-0 p-0 overflow-hidden max-h-[90vh]"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(40px) saturate(200%)",
            WebkitBackdropFilter: "blur(40px) saturate(200%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          }}
        >
          <Suspense fallback={<div className="flex items-center justify-center h-96">Loading...</div>}>
            <CVViewer />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Dark Mode Toggle */}
      <motion.div
        className="w-16 h-16 rounded-full cursor-pointer shadow-lg flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ 
          background: isDarkMode 
            ? "rgba(255, 255, 255, 0.1)" 
            : "rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
        }}
        onClick={toggleDarkMode}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6" style={{ color: isDarkMode ? '#f8f8f8' : '#374151' }} />
        ) : (
          <Moon className="w-6 h-6" style={{ color: isDarkMode ? '#f8f8f8' : '#374151' }} />
        )}
      </motion.div>

      {/* Color Palette Selector */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
                  <motion.div
          className="w-16 h-16 rounded-full cursor-pointer shadow-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotate: 360
          }}
          transition={{ 
            scale: { delay: 0.5 },
            opacity: { delay: 0.5 },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
          }}
          style={{ 
            background: `linear-gradient(45deg, ${appliedPalette.primary}, ${appliedPalette.accent})`,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
          }}
          whileHover={{ scale: 1.1, rotate: 0 }}
          whileTap={{ scale: 0.9 }}
        >
            <div 
              className="absolute inset-2 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)"
              }}
            >
              <Palette className="w-6 h-6 text-gray-700" />
            </div>
            <div 
              className="absolute inset-0 rounded-full opacity-20"
              style={{ 
                background: `linear-gradient(45deg, ${appliedPalette.primary}, ${appliedPalette.accent})` 
              }}
            />
          </motion.div>
        </DialogTrigger>
        <DialogContent 
          className="sm:max-w-md border-0 p-0 overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(40px) saturate(200%)",
            WebkitBackdropFilter: "blur(40px) saturate(200%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          }}
        >
                              <ColorPaletteDialog 
                      currentPalette={currentPalette}
                      onPaletteSelect={handlePaletteSelect}
                      onSave={handleSave}
                      isDarkMode={isDarkMode}
                      isSaving={isSaving}
                    />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ColorPaletteDialogProps {
  currentPalette: ColorPaletteKey
  onPaletteSelect: (palette: ColorPaletteKey) => void
  onSave: () => void
  isDarkMode: boolean
  isSaving?: boolean
}

function ColorPaletteDialog({ currentPalette, onPaletteSelect, onSave, isDarkMode, isSaving = false }: ColorPaletteDialogProps) {
  return (
    <div 
      className="p-6 space-y-4"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)"
      }}
    >
      <div className="text-center">
        <h2 
          className="text-2xl font-bold mb-2"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))"
          }}
        >
          Choose Your Palette
        </h2>
        <p 
          className="text-sm"
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
          }}
        >
          Select a color scheme that matches your mood
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(colorPalettes).map(([key, palette]) => {
          // Use original palette colors for previews as requested
          const previewPalette = palette

          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer transition-all border-0 overflow-hidden"
                style={{
                  background: currentPalette === key 
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  border: currentPalette === key 
                    ? `2px solid ${previewPalette.accent}40`
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: currentPalette === key
                    ? `0 8px 32px ${previewPalette.accent}20, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                    : "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                }}
                onClick={() => onPaletteSelect(key as ColorPaletteKey)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded shadow-sm" 
                        style={{ 
                          backgroundColor: previewPalette.primary,
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                        }}
                      />
                      <div 
                        className="w-4 h-4 rounded shadow-sm" 
                        style={{ 
                          backgroundColor: previewPalette.accent,
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                        }}
                      />
                    </div>
                    <span 
                      className="text-sm font-medium"
                      style={{ 
                        color: "rgba(255, 255, 255, 0.9)",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      {palette.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div 
                      className="h-8 rounded shadow-sm" 
                      style={{ 
                        backgroundColor: previewPalette.primary,
                        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)"
                      }}
                    />
                    <div 
                      className="h-8 rounded shadow-sm" 
                      style={{ 
                        backgroundColor: previewPalette.accent,
                        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)"
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="flex items-center gap-2 border-0"
          style={{
            background: isSaving 
              ? "rgba(255, 255, 255, 0.05)" 
              : "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            color: isSaving 
              ? "rgba(255, 255, 255, 0.5)" 
              : "rgba(255, 255, 255, 0.9)",
            opacity: isSaving ? 0.7 : 1
          }}
        >
          <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
          {isSaving ? 'Saving...' : 'Save Preference'}
        </Button>
      </div>
    </div>
  )
}

function CVViewer() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleViewInNewTab = useCallback(() => {
    window.open("/Sean_Motanya_3_Years_Experience_Software_Developer_Designer_2025.pdf", '_blank', 'noopener,noreferrer')
  }, [])

  const cvPreviewUrl = "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/Sean_Motanya_3_Years_Experience_Software_Developer_Designer_2025.pdf"

  return (
    <div 
      className="p-6 space-y-4"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)"
      }}
    >
      <div className="text-center">
        <h2 
          className="text-2xl font-bold mb-2"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))"
          }}
        >
          Sean Motanya - CV
        </h2>
        <p 
          className="text-sm mb-4"
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
          }}
        >
          {isMobile ? "View and download my resume" : "Preview my resume and download if you'd like"}
        </p>
      </div>

      {/* Desktop CV Preview */}
      {!isMobile && (
        <div 
          className="w-full h-96 sm:h-[500px] rounded-lg overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}
        >
          <iframe
            src={cvPreviewUrl}
            className="w-full h-full"
            title="Sean Motanya CV Preview"
            style={{
              border: 'none', 
              borderRadius: '8px',
            }}
            loading="lazy"
          />
        </div>
      )}

      {/* Mobile CV Actions */}
      {isMobile && (
        <div className="space-y-3">
          <div 
            className="w-full h-32 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-2" style={{ color: "rgba(255, 255, 255, 0.7)" }} />
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }} className="text-sm">
                PDF Document Ready
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-center'} pt-4`}>
        {isMobile && (
          <Button 
            onClick={handleViewInNewTab}
            className="flex items-center justify-center gap-2 border-0 w-full"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              color: "rgba(255, 255, 255, 0.9)"
            }}
          >
            <FileText className="w-4 h-4" />
            View in New Tab
          </Button>
        )}
        

 
      </div>
    </div>
  )
}