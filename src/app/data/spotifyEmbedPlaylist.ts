export const SPOTIFY_EMBED_SRCS: string[] = [
  "https://open.spotify.com/embed/track/7L30D0YGMhy87Zdxlrk28J?utm_source=generator",
  "https://open.spotify.com/embed/track/7Cuk8jsPPoNYQWXK9XRFvG?utm_source=generator",
  "https://open.spotify.com/embed/track/5FVd6KXrgO9B3JPmC8OPst?utm_source=generator",
  "https://open.spotify.com/embed/track/7L30D0YGMhy87Zdxlrk28J?utm_source=generator",
  "https://open.spotify.com/embed/track/6K4t31amVTZDgR3sKmwUJJ?utm_source=generator",
  "https://open.spotify.com/embed/track/5rO9aFImIWWwM5e7jJPnju?utm_source=generator",
  "https://open.spotify.com/embed/track/33Vhm96V7UkegsXlfhMgXq?utm_source=generator",
  "https://open.spotify.com/embed/track/323ujVhfSg16TlRK0PB5JY?utm_source=generator",
  "https://open.spotify.com/embed/track/1WiAWAb50cD1eLqstTFer4?utm_source=generator",
  "https://open.spotify.com/embed/track/1w8lmX9rLX5GTcoqkVoNtr?utm_source=generator",
  "https://open.spotify.com/embed/track/1DpC4L3JjsGRW7y6eTHaMj?utm_source=generator",
  "https://open.spotify.com/embed/track/1AtBzcUzKLh4BGwXhFA9K6?utm_source=generator",
  "https://open.spotify.com/embed/track/42H2uitTxFmfaKvbNYDI9t?utm_source=generator",
  "https://open.spotify.com/embed/track/6liOmfoLTZ1gWJQJnXaSTZ?utm_source=generator",
  "https://open.spotify.com/embed/track/7h0H6LE3rDqQiftHQWE54L?utm_source=generator",
  "https://open.spotify.com/embed/track/1oxXlEFJ5zX7GwyhbuJqZZ?utm_source=generator",
  "https://open.spotify.com/embed/track/1gtdvDFrAvdhY3rQxwXkf9?utm_source=generator",
  "https://open.spotify.com/embed/track/6RxDO2zNJ4ydmwRseHjvWf?utm_source=generator",
  "https://open.spotify.com/embed/track/3gY6tiCNsuVi6s8kPV6aQg?utm_source=generator",
  "https://open.spotify.com/embed/track/2TAKt1x0k9AltDJm31GhEu?utm_source=generator",



]

export function getSimulatedSpotifyEmbedIndex(
  totalTracks: number,
  intervalMs: number = 120000,
  nowMs: number = Date.now(),
): number {
  if (totalTracks <= 0) return 0

  const safeIntervalMs = intervalMs > 0 ? intervalMs : 120000
  return Math.floor(nowMs / safeIntervalMs) % totalTracks
}

export function getSimulatedSpotifyEmbedSrc(
  embedSrcs: string[],
  intervalMs: number = 120000,
  nowMs: number = Date.now(),
): string | null {
  if (!embedSrcs.length) return null

  const index = getSimulatedSpotifyEmbedIndex(embedSrcs.length, intervalMs, nowMs)
  return embedSrcs[index]
}
