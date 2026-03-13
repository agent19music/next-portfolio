"use client"

import useSWR from "swr"
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
  const apiUrl = `/api/spotify-embed?intervalMs=${intervalMs}`
  const { data } = useSWR<{ src: string }>(
    apiUrl,
    (url: string) => fetch(url).then((res) => (res.ok ? res.json() : null)),
    {
      refreshInterval: 15000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  )

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

  const src = data?.src ?? embedSrcs[0]

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

