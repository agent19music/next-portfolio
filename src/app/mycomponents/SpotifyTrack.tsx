"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Pause, Music, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SpotifyTrack {
  albumImageUrl: string;
  albumName: string;
  artistName: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
  playedAt: string;
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

  if (isLoading) {
    return (
      <div className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1 space-y-2">
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
      className="w-full overflow-hidden rounded-lg border-2 border-mocha dark:border-gray-800 bg-petal dark:bg-gray-950 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <a 
        href={data.songUrl} 
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4"
      >
        <div className="flex items-center gap-4">
          {data.albumImageUrl ? (
            <div className="relative min-w-16 h-16 rounded-md overflow-hidden shadow-sm">
              <Image
                src={data.albumImageUrl}
                alt={data.albumName || 'Album cover'}
                width={64}
                height={64}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                {data.isPlaying ? (
                  <Pause className="text-mocha" size={24} />
                ) : (
                  <Play className="text-mocha" size={24} />
                )}
              </div>
            </div>
          ) : (
            <div className="min-w-16 h-16 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Music className="text-gray-400" size={24} />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm sm:text-base text-mocha dark:text-gray-100 truncate">
              {data.title || 'Unknown Track'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
              {data.artistName || 'Unknown Artist'} · {data.albumName || 'Unknown Album'}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${
                data.isPlaying 
                  ? 'bg-green-500 animate-pulse' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}></span>
              <p className="text-xs text-gray-400 dark:text-gray-500">
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

