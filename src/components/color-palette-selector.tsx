"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Save, Moon, Sun, Download, Eye } from "lucide-react"
import { useColorPalette } from "@/contexts/color-palette-context"

// Color palette definitions
export const colorPalettes = {
  "muder": {
    name: "Muder",
    background: "#FCF7F8", // snow
    text: "#A31621", // madder
    accent: "#A31621", // madder
    primary: "#FCF7F8", // snow
    secondary: "#A31621", // madder
    muted: "#F2F0E6", // alabaster
  },
  "monochrome": {
    name: "Monochrome",
    background: "#FFFFFF", // white
    text: "#000000", // black
    accent: "#000000", // black
    primary: "#FFFFFF", // white
    secondary: "#000000", // black
    muted: "#000000", // black
  },
  "sunset": {
    name: "Sunset",
    background: "#FDF1F5", // petal
    text: "#EE8E46", // sunset
    accent: "#EE8E46", // sunset
    primary: "#FDF1F5", // petal
    secondary: "#EE8E46", // sunset
    muted: "#FEF7F9", // lighter petal
  },
  "calm": {
    name: "Calm",
    background: "#F2F0E6", // alabaster
    text: "#7E8C54", // mossgreen
    accent: "#7E8C54", // mossgreen
    primary: "#F2F0E6", // alabaster
    secondary: "#7E8C54", // mossgreen
    muted: "#F8F6F0", // lighter alabaster
  },
  "lilac": {
    name: "Lilac",
    background: "#F0EAD6", // eggshell
    text: "#C8A2C8", // lilac
    accent: "#C8A2C8", // lilac
    primary: "#F0EAD6", // eggshell
    secondary: "#C8A2C8", // lilac
    muted: "#F7F3E8", // lighter eggshell
  },
  "mocha": {
    name: "Mocha",
    background: "#FDF1F5", // petal
    text: "#92736C", // mocha
    accent: "#92736C", // mocha
    primary: "#FDF1F5", // petal
    secondary: "#92736C", // mocha
    muted: "#F2F0E6", // alabaster
  },
}

export type ColorPaletteKey = keyof typeof colorPalettes

interface ColorPaletteSelectorProps {
  onPaletteChange: (palette: ColorPaletteKey) => void
  currentPalette: ColorPaletteKey
}

// Smart dark mode color transformations
function getDarkModeTransformation(paletteKey: string): {
  background: string;
  text: string;
  accent: string;
  primary: string;
  secondary: string;
  muted: string;
} {
  // Define smart dark mode transformations for each palette
  const darkModeTransformations: Record<string, {
    background: string;
    text: string;
    accent: string;
    primary: string;
    secondary: string;
    muted: string;
  }> = {
    "muder": {
      background: "#1a1214", // deep dark with red undertone
      text: "#ff6b7a", // lighter, more vibrant red for dark mode
      accent: "#ff4757", // vibrant red accent
      primary: "#2d1b1e", // dark primary with red undertone
      secondary: "#ff6b7a", // matching text color
      muted: "#251a1c", // subtle dark muted
    },
    "monochrome": {
      background: "#0f0f0f", // pure dark
      text: "#ffffff", // pure white
      accent: "#ffffff", // pure white accent
      primary: "#1a1a1a", // dark gray primary
      secondary: "#ffffff", // white secondary
      muted: "#262626", // dark muted
    },
    "sunset": {
      background: "#1a1015", // dark with warm undertone
      text: "#ffb366", // warmer, brighter orange
      accent: "#ff8c42", // vibrant sunset orange
      primary: "#2d1f1a", // warm dark primary
      secondary: "#ffb366", // matching text
      muted: "#241c18", // warm dark muted
    },
    "calm": {
      background: "#131514", // dark with green undertone
      text: "#a8c474", // lighter, more vibrant green
      accent: "#9bb65d", // fresh green accent
      primary: "#1f2220", // dark green primary
      secondary: "#a8c474", // matching text
      muted: "#1a1d1b", // subtle green-tinted dark
    },
    "lilac": {
      background: "#161115", // dark with purple undertone
      text: "#e8a8e8", // lighter, more vibrant lilac
      accent: "#d892d8", // bright lilac accent
      primary: "#251f25", // dark purple primary
      secondary: "#e8a8e8", // matching text
      muted: "#1f1a1f", // subtle purple-tinted dark
    },
    "mocha": {
      background: "#15110f", // dark with brown undertone
      text: "#c4a394", // lighter, warmer brown
      accent: "#b8967c", // warm mocha accent
      primary: "#231d1a", // warm dark primary
      secondary: "#c4a394", // matching text
      muted: "#1d1815", // warm dark muted
    },
  }

  return darkModeTransformations[paletteKey.toLowerCase()] || {
    background: "#1a1a1a",
    text: "#ffffff",
    accent: "#ffffff",
    primary: "#2a2a2a",
    secondary: "#ffffff",
    muted: "#262626",
  }
}



export function ColorPaletteSelector({ onPaletteChange, currentPalette }: ColorPaletteSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [savedPalette, setSavedPalette] = useState<ColorPaletteKey>("mocha")
  const [showCV, setShowCV] = useState(false)

  // Use context for dark mode state
  const { isDarkMode, setIsDarkMode } = useColorPalette()

  // Load saved palette on mount
  useEffect(() => {
    const saved = localStorage.getItem("color-palette")
    if (saved && saved in colorPalettes) {
      setSavedPalette(saved as ColorPaletteKey)
      onPaletteChange(saved as ColorPaletteKey)
    }
  }, [onPaletteChange])

  const handlePaletteSelect = (palette: ColorPaletteKey) => {
    onPaletteChange(palette)
    setIsCollapsed(true)
    setIsOpen(false)
  }

  const handleSave = () => {
    localStorage.setItem("color-palette", currentPalette)
    setSavedPalette(currentPalette)
    setIsCollapsed(true)
    setIsOpen(false)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const currentPaletteData = colorPalettes[currentPalette]
  
  // Apply dark mode transformations
  const appliedPalette = isDarkMode ? getDarkModeTransformation(currentPalette) : currentPaletteData

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
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              }}
            >
              <Download className="w-5 h-5" style={{ color: appliedPalette.text }} />
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
            <CVViewer />
          </DialogContent>
        </Dialog>

        {/* Dark Mode Toggle */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
          }}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" style={{ color: appliedPalette.text }} />
          ) : (
            <Moon className="w-5 h-5" style={{ color: appliedPalette.text }} />
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
                    style={{ backgroundColor: appliedPalette.primary }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: appliedPalette.accent }}
                  />
                </div>
                <span 
                  className="text-sm font-medium backdrop-blur-sm"
                  style={{ color: appliedPalette.text }}
                >
                  {currentPaletteData.name}
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
              background: `linear-gradient(45deg, ${appliedPalette.primary}, ${appliedPalette.accent})`,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Download className="w-6 h-6 text-gray-700" />
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
          <CVViewer />
        </DialogContent>
      </Dialog>

      {/* Dark Mode Toggle */}
      <motion.div
        className="w-16 h-16 rounded-full cursor-pointer shadow-lg flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ 
          background: `linear-gradient(45deg, ${appliedPalette.primary}, ${appliedPalette.accent})`,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
        }}
        onClick={toggleDarkMode}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-gray-700" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700" />
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
}

function ColorPaletteDialog({ currentPalette, onPaletteSelect, onSave, isDarkMode }: ColorPaletteDialogProps) {
  return (
    <div 
      className="space-y-4 p-6"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)"
      }}
    >
      <div className="text-center">
        <h2 
          className="text-xl font-bold mb-2"
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
          className="flex items-center gap-2 border-0"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            color: "rgba(255, 255, 255, 0.9)"
          }}
        >
          <Save className="w-4 h-4" />
          Save Preference
        </Button>
      </div>
    </div>
  )
}

function CVViewer() {
  const handleDownload = () => {
    // 🔥 REPLACE THIS WITH YOUR ACTUAL R2 BUCKET URL 🔥
    const cvUrl = "https://your-r2-bucket-url.com/path/to/sean-motanya-cv.pdf"
    window.open(cvUrl, '_blank')
  }

  // 🔥 REPLACE THIS WITH YOUR ACTUAL R2 BUCKET URL FOR PREVIEW 🔥
  const cvPreviewUrl = "https://your-r2-bucket-url.com/path/to/sean-motanya-cv.pdf"

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
          Preview my resume and download if you&apos;d like
        </p>
      </div>

      {/* CV Preview - SCROLLABLE */}
      <div 
        className="w-full h-96 sm:h-[500px] rounded-lg overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        {cvPreviewUrl && cvPreviewUrl !== "https://your-r2-bucket-url.com/path/to/sean-motanya-cv.pdf" ? (
          /* 🔥 THIS IS WHERE YOUR RESUME WILL BE DISPLAYED - SCROLLABLE 🔥 */
          <iframe
            src={`${cvPreviewUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full h-full"
            title="Sean Motanya CV Preview"
            style={{
              border: 'none',
              borderRadius: '8px',
            }}
          />
        ) : (
          /* Placeholder when no URL is set */
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
            <Eye className="w-12 h-12 mx-auto mb-4" style={{ color: "rgba(255, 255, 255, 0.7)" }} />
            <p style={{ color: "rgba(255, 255, 255, 0.7)" }} className="mb-2">
              CV Preview
            </p>
            <p className="text-sm mb-4" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              Replace the cvPreviewUrl variable above with your R2 bucket URL
            </p>
            <div className="text-xs font-mono bg-black/20 p-3 rounded" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              📁 Update cvPreviewUrl in CVViewer function
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleDownload}
          className="flex items-center gap-2 border-0"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            color: "rgba(255, 255, 255, 0.9)"
          }}
        >
          <Download className="w-4 h-4" />
          Download CV
        </Button>
      </div>
    </div>
  )
} 