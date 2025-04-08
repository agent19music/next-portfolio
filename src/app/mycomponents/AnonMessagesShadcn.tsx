"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Image, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import dynamic from 'next/dynamic';
import eggAnimationData from "@/app/assets/eggAnimation.json";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { cn } from "@/lib/utils";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not set.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EasterEggMessageForm() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const lottieRef = useRef(null);

  const handleEggClick = () => {
    setShowForm(true);
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
    if (!message.trim() && !file) return;

    try {
      setIsSubmitting(true);
      setError("");

      let imageUrl = null;

      // Upload image if there is one
      if (file) {
        imageUrl = await uploadImage(file);
      }

      // Insert message into database
      const { error: insertError } = await supabase
        .from("anonymous_messages")
        .insert([
          {
            message: message.trim(),
            image_url: imageUrl,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error("Error saving message:", insertError.message);
        throw new Error("Failed to save message");
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

  if (!showForm) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center my-12 cursor-pointer" onClick={handleEggClick}>
        <div className="relative">
          <div className="mt-4 text-xl font-bold text-sunset animate-bounce">
            You found an Easter Egg!!
          </div>
          <div className="text-sm text-muted-foreground">
            Click to reveal a secret
          </div>
          <div className="w-40 h-40 mx-auto">
            <DotLottieReact 
              src = 'https://lottie.host/af1bae9e-d71d-4522-9dba-5cc4b23eb345/BAFlJNuQDQ.lottie'
              loop = {true}
              autoplay = {true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-6">
        <div className="space-y-2">
          <div className="inline-block rounded-lg bg-sunset text-petal px-3 py-1 text-sm font-medium">You found a secret!</div>
          <h2 className="text-2xl font-bold tracking-tighter">Leave an Anonymous Note</h2>
          <p className="text-muted-foreground md:text-base/relaxed">
            Share your thoughts without revealing your identity
          </p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
        {/* Message input area */}
        <div className="p-6">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What would you like to say?"
              className={cn(
                "flex w-full min-h-32 rounded-md border border-input bg-background px-3 py-2 text-sm", 
                "ring-offset-background placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              )}
            />

            {/* Image preview */}
            {imagePreview && (
              <div className="mt-3">
                <div className="relative rounded-md overflow-hidden border border-border w-32 h-32">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className={cn(
                      "absolute top-1 right-1 h-6 w-6 rounded-full flex items-center justify-center",
                      "bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
                    )}
                    type="button"
                    aria-label="Remove image"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-3 text-sm text-destructive">{error}</div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div>
                <label className={cn(
                  "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium",
                  "h-10 w-10 transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                  <Image size={20} className="text-muted-foreground" />
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (!message.trim() && !file) || isSent}
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium",
                  "h-10 px-4 py-2 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isSent 
                    ? "bg-success text-success-foreground hover:bg-success/90" 
                    : (!message.trim() && !file) || isSubmitting
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                type="button"
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

