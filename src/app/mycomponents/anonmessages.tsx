"use client";
import React, { useState, useCallback } from "react";
import { Send, Image, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not set.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AnonymousMessageInput() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const errorData = await response.json();
        console.error("Error uploading file:", errorData.error);
        throw new Error("Failed to upload image");
      }
      
      // Get the public URL from the response
      const data = await response.json();
      return data.url || null;
    } catch (error) {
      console.error("Error in upload process:", error);
      throw new Error("Failed to upload image");
    }
  };
  
  const handleSubmit = useCallback(async () => {
    if (!message.trim() && !file) return;

    try {
      setIsSubmitting(true);
      setError("");

      let imageUrl: string | null = null;

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

      // Clear form and show success
      setMessage("");
      setFile(null);
      setImagePreview(null);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [message, file]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-medium bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Send Anonymous Message
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Your identity will remain private
          </p>
        </div>

        {/* Message input area */}
        <div className="p-6">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What would you like to say?"
              className="w-full min-h-32 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none placeholder:text-gray-400"
            />

            {/* Image preview */}
            {imagePreview && (
              <div className="mt-3 relative">
                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 w-32 h-32">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-3 text-sm text-red-500">{error}</div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div>
                <label className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors inline-flex">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Image size={20} className="text-indigo-500" />
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (!message.trim() && !file)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-white ${
                  (!message.trim() && !file) || isSubmitting
                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 shadow-md hover:shadow-lg transition-all"
                }`}
              >
                <span>{isSubmitting ? "Sending..." : "Send"}</span>
                <Send size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success notification */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-3 rounded-lg shadow-lg border border-green-200 dark:border-green-800 flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          <p>Message sent successfully!</p>
        </div>
      )}
    </div>
  );
}