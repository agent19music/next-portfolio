"use client"

import { useEffect, useState } from "react"
import { Music } from "lucide-react"

type SpotifyEmbedPlaylistProps = {
  embedSrcs: string[]
  intervalMs?: number
  height?: number
}

export function SpotifyEmbedPlaylist({
  embedSrcs,
  intervalMs = 120000,
  height = 152,
}: SpotifyEmbedPlaylistProps) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (embedSrcs.length <= 1) return

    const id = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % embedSrcs.length)
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [embedSrcs, intervalMs])

  if (!embedSrcs.length) {
    return (
      <div className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
          <Music size={18} />
          <p className="text-sm font-medium">No playlist tracks configured.</p>
        </div>
      </div>
    )
  }

  const src = embedSrcs[idx % embedSrcs.length]

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-md shadow-black/5 dark:shadow-white/5">
      <iframe
        data-testid="embed-iframe"
        style={{ borderRadius: 12 }}
        src={src}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  )
}

