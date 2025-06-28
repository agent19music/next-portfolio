"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Pause, Music, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useColorPalette } from "@/contexts/color-palette-context";

interface SpotifyTrack {
  albumImageUrl: string;
  albumName: string;
  artistName: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
  playedAt: string;
}

// Custom component for text that slides horizontally when it doesn't fit
function SlidingText({ 
  children, 
  className = "",
  hoverOnly = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  hoverOnly?: boolean;
}) {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Check if the text is overflowing its container
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const isTextOverflowing = textRef.current.scrollWidth > containerRef.current.clientWidth;
        setIsOverflowing(isTextOverflowing);
      }
    };

    checkOverflow();
    
    // Recheck on window resize
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [children]);

  // Determine if we should animate based on overflow and hover state
  const shouldAnimate = isOverflowing && (!hoverOnly || (hoverOnly && isHovering));

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        ref={textRef}
        animate={shouldAnimate ? {
          x: [0, -100, 0],
        } : {
          x: 0
        }}
        transition={shouldAnimate ? {
          x: {
            duration: 10,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            repeatDelay: 1,
          }
        } : {}}
        style={{ 
          width: "max-content", 
          display: "inline-block",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error('Failed to fetch Spotify data');
  }
  return res.json().then(data => {
    // Map API response properties to the expected interface properties
    return {
      albumImageUrl: data.albumArt,
      albumName: data.album,
      artistName: data.artist,
      isPlaying: data.isPlaying || false,
      songUrl: data.spotifyUrl,
      title: data.title,
      playedAt: data.playedAt
    } as SpotifyTrack;
  });
});

export function SpotifyTrack() {
  const { paletteData } = useColorPalette();
  const { data, error, isLoading, mutate } = useSWR<SpotifyTrack>(
    '/api/spotify',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  // Handle refresh on visibility change (when tab becomes visible again)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        mutate();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mutate]);

  // Calculate animation distance based on text content
  const getAnimationDistance = (textWidth: number, containerWidth: number): number => {
    // Only animate if text is wider than container
    if (textWidth <= containerWidth) return 0;
    // Return negative percentage that would fully show all text
    return -((textWidth / containerWidth * 100) - 100);
  };

  if (isLoading) {
    return (
      <div className="w-full p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 animate-pulse">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-md bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full p-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-3 text-red-800 dark:text-red-400">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">Unable to fetch Spotify data</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-full overflow-hidden rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ 
        borderColor: paletteData.accent,
        backgroundColor: paletteData.primary
      }}
    >
      <a 
        href={data.songUrl} 
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 sm:p-5 md:p-6"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          {data.albumImageUrl ? (
            <div className="relative min-w-16 sm:min-w-20 h-16 sm:h-20 rounded-md overflow-hidden shadow-sm">
              <Image
                src={data.albumImageUrl}
                alt={data.albumName || 'Album cover'}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                {data.isPlaying ? (
                  <Pause size={24} style={{ color: paletteData.accent }} />
                ) : (
                  <Play size={24} style={{ color: paletteData.accent }} />
                )}
              </div>
            </div>
          ) : (
            <div className="min-w-16 sm:min-w-20 h-16 sm:h-20 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Music className="text-gray-400" size={24} />
            </div>
          )}
          
          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
            <SlidingText className="font-medium text-base sm:text-lg" style={{ color: paletteData.accent }}>
              {data.title || 'Unknown Track'}
            </SlidingText>
            <SlidingText className="text-sm text-gray-500 dark:text-gray-400">
              {data.artistName || 'Unknown Artist'} · {data.albumName || 'Unknown Album'}
            </SlidingText>
            <div className="mt-1 flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${
                data.isPlaying 
                  ? 'bg-green-500 animate-pulse' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}></span>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                {data.isPlaying 
                  ? 'Now playing' 
                  : data.playedAt 
                    ? `Played ${formatDistanceToNow(new Date(data.playedAt), { addSuffix: true })}` 
                    : 'Recently played'
                }
              </p>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

