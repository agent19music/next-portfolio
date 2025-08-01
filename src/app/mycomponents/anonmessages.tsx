"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Image, X } from "lucide-react";
import {Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import dynamic from 'next/dynamic';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useColorPalette } from "@/contexts/color-palette-context";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Removed session ID generation for privacy

export default function EasterEggMessageForm() {
  const { paletteData } = useColorPalette();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [isEggCracking, setIsEggCracking] = useState(false);
  const lottieRef = useRef(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleEggClick = () => {
    // Start the cracking animation
    setIsEggCracking(true);
    
    // After animation completes, show the form
    setTimeout(() => {
      setShowEasterEgg(true);
    }, 2000); // Match this with the duration of your cracking animation
  };

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & {
        files: FileList | null;
    };
  }

  const handleImageChange = (e: FileChangeEvent) => {
    if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];

        // Check file size (limit to 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File size exceeds 5MB limit");
            return;
        }

        setFile(selectedFile);
        setImagePreview(URL.createObjectURL(selectedFile));
        setError("");
    }
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
  };

  interface UploadResponse {
    url: string | null;
    error?: string;
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
        // Create FormData and append the file
        const formData = new FormData();
        formData.append('file', file);
        
        // Send file to our API route
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorData: UploadResponse = await response.json();
            console.error("Error uploading file:", errorData.error);
            throw new Error("Failed to upload image");
        }
        
        // Get the public URL from the response
        const data: UploadResponse = await response.json();
        return data.url || null;
    } catch (error) {
        console.error("Error in upload process:", error);
        throw new Error("Failed to upload image");
    }
  };
  
  const handleSubmit = async () => {
    // Message is required - images are optional
    if (!message.trim()) return;

    try {
      setIsSubmitting(true);
      setError("");

      let imageUrl = null;

      // Upload image if there is one
      if (file) {
        try {
          imageUrl = await uploadImage(file);
        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      }

      // Send message to our API route
      const response = await fetch('/api/supabase-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(), // Message is always required
          imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save message");
      }

      // Show success in button
      setIsSent(true);
      
      setTimeout(() => {
        // Reset form after showing success
        setMessage("");
        setFile(null);
        setImagePreview(null);
        setIsSent(false);
      }, 700);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showEasterEgg) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center space-y-4 text-center my-12 cursor-pointer" 
        onClick={handleEggClick}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.div 
            className="mt-4 text-xl font-bold"
            style={{ color: paletteData.accent }}
            animate={{
              y: [0, -10, 0],
              transition: {
                repeat: Infinity,
                duration: 1.5
              }
            }}
          >
            You found an Easter Egg!!
          </motion.div>
          <div className="text-sm text-gray-500"
          style={{ color: paletteData.muted }}
          >
            Click to reveal a secret
          </div>
          
          {/* Custom egg cracking animation using Framer Motion instead of Lottie */}
          <motion.div 
            className="w-40 h-40 mx-auto relative"
          >
            {isEggCracking ? (
              // Custom egg cracking animation with fragments
              <div className="relative w-full h-full">
                {/* Egg fragments flying out */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-8 h-8 bg-[#F9E7D2] rounded-full z-10"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      x: Math.sin(i * Math.PI/4) * 100, 
                      y: Math.cos(i * Math.PI/4) * 100, 
                      opacity: [0, 1, 0],
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{
                      borderRadius: "50% 60% 50% 40%",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                ))}
                
                {/* Center glow */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-100 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 3, 4],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{ duration: 1.5 }}
                  style={{
                    filter: "blur(10px)",
                    background: "radial-gradient(circle, rgba(255,255,190,1) 0%, rgba(255,223,128,0) 70%)"
                  }}
                />
                
                {/* The egg breaking apart */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-40"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 0] }}
                  transition={{ duration: 0.8 }}
                >
                  <svg viewBox="0 0 100 120" width="100%" height="100%">
                    <motion.path
                      d="M50,10 C70,10 90,40 90,80 C90,100 70,110 50,110 C30,110 10,100 10,80 C10,40 30,10 50,10 Z"
                      fill="#F9E7D2"
                      stroke="#E8D0B0"
                      strokeWidth="2"
                      initial={{ pathLength: 1 }}
                      animate={{ 
                        pathLength: [1, 0.8, 0.6, 0.4, 0.2, 0],
                        pathOffset: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </svg>
                </motion.div>
              </div>
            ) : (
              // Regular egg animation
              <DotLottieReact 
                src="https://lottie.host/af1bae9e-d71d-4522-9dba-5cc4b23eb345/BAFlJNuQDQ.lottie"
                loop={true}
                autoplay={true}
                speed={2}
              />
            )}
          </motion.div>
          
          {isEggCracking && (
            <motion.div
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <motion.div 
                className="text-lg font-bold"
                style={{ color: paletteData.accent }}
                animate={{
                  scale: [0.8, 1.2, 1],
                  transition: { duration: 0.5, delay: 1.2 }
                }}
              >
                Easter secret revealed!
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="w-full max-w-2xl mx-auto mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4 text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="space-y-2">
            <motion.div 
              className="inline-block rounded-lg px-3 py-1 text-sm"
              style={{ backgroundColor: paletteData.accent, color: paletteData.primary }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
            >
              You found a secret!
            </motion.div>
            <motion.h2 
              className="text-2xl font-bold tracking-tighter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Leave an Anonymous Note
            </motion.h2>
            <motion.p 
              className="text-muted-foreground md:text-base/relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{ color: paletteData.muted }}
            >
              Share your thoughts without revealing your identity
            </motion.p>
          </div>
        </motion.div>
        
        <motion.div 
          className="rounded-lg shadow-md shadow-black/5 dark:shadow-white/5 overflow-hidden"
          style={{ backgroundColor: paletteData.primary }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Message input area */}
          <div className="p-6">
            <div className="relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What would you like to say?"
                className="w-full min-h-32 p-4 rounded-lg border-0 shadow-sm shadow-black/5 dark:shadow-white/5"
                style={{ backgroundColor: paletteData.primary, color: paletteData.text }}
              />

              {/* Image preview */}
              {imagePreview && (
                <motion.div 
                  className="mt-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative rounded-lg overflow-hidden shadow-sm shadow-black/5 dark:shadow-white/5 w-32 h-32">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all"
                    >
                      <X size={14} className="text-white" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Error message */}
              {error && (
                <motion.div 
                  className="mt-3 text-sm text-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <div>
                  <label className="cursor-pointer p-2 rounded-lg dark:hover:bg-gray-800 transition-colors inline-flex">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Image size={20} style={{ color: paletteData.muted }} />
                  </label>
                </div>

                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !message.trim() || isSent}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor: isSent 
                        ? "#22c55e" 
                        : !message.trim() || isSubmitting
                          ? "#d1d5db"
                          : paletteData.text,
                      color: isSent || (!message.trim() || isSubmitting)
                        ? "#ffffff"
                        : paletteData.background,
                      cursor: !message.trim() || isSubmitting ? "not-allowed" : "pointer"
                    }}
                  >
                    {isSent ? (
                      "Sent!"
                    ) : isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <span>Send</span>
                        <Send size={16} className="ml-1" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}