import { NextResponse } from "next/server"
import {
  SPOTIFY_EMBED_SRCS,
  getSimulatedSpotifyEmbedIndex,
  getSimulatedSpotifyEmbedSrc,
} from "@/app/data/spotifyEmbedPlaylist"

export const dynamic = "force-dynamic"
export const revalidate = 0

const DEFAULT_INTERVAL_MS = 120000

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const intervalParam = Number(searchParams.get("intervalMs"))
  const intervalMs = Number.isFinite(intervalParam) && intervalParam > 0
    ? intervalParam
    : DEFAULT_INTERVAL_MS

  const src = getSimulatedSpotifyEmbedSrc(SPOTIFY_EMBED_SRCS, intervalMs)
  const idx = getSimulatedSpotifyEmbedIndex(SPOTIFY_EMBED_SRCS.length, intervalMs)

  if (!src) {
    return NextResponse.json(
      { error: "No playlist tracks configured." },
      { status: 404 },
    )
  }

  return NextResponse.json({
    src,
    idx,
    total: SPOTIFY_EMBED_SRCS.length,
    intervalMs,
    serverTime: new Date().toISOString(),
  })
}
