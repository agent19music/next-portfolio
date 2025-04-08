import { serialize, parse } from 'cookie';

// Types for Spotify API responses
export interface SpotifyAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface SpotifyTrackItem {
  track: {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string }>;
    };
    external_urls: {
      spotify: string;
    };
    duration_ms: number;
  };
  played_at: string;
}

export interface SpotifyRecentlyPlayedResponse {
  items: SpotifyTrackItem[];
  next: string | null;
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  href: string;
}

// Environment variables needed
// SPOTIFY_CLIENT_ID
// SPOTIFY_CLIENT_SECRET
// SPOTIFY_REDIRECT_URI
// SPOTIFY_REFRESH_TOKEN (once obtained)

// Constants
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE = 'https://accounts.spotify.com/api';
const SCOPES = [
  'user-read-recently-played',
  'user-read-playback-state',
  'user-top-read',
].join(' ');

/**
 * Generate the Spotify authorization URL
 */
export function getAuthorizationUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID || '',
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI || '',
    scope: SCOPES,
    show_dialog: 'true',
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access and refresh tokens
 */
export async function getSpotifyTokens(code: string): Promise<SpotifyAccessToken> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI || '',
  });

  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data: SpotifyAccessToken = await response.json();
  return data;
}

/**
 * Refresh the access token using the refresh token
 */
export async function refreshAccessToken(
  refreshToken: string = process.env.SPOTIFY_REFRESH_TOKEN || ''
): Promise<string> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Get the most recently played track
 */
export async function getRecentlyPlayedTrack(
  accessToken?: string
): Promise<SpotifyTrackItem | null> {
  try {
    const token = accessToken || await refreshAccessToken();
    
    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/player/recently-played?limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, try refreshing
        const newToken = await refreshAccessToken();
        return getRecentlyPlayedTrack(newToken);
      }
      throw new Error(`Failed to fetch recently played tracks: ${response.statusText}`);
    }

    const data: SpotifyRecentlyPlayedResponse = await response.json();
    return data.items.length > 0 ? data.items[0] : null;
  } catch (error) {
    console.error('Error fetching recently played track:', error);
    return null;
  }
}

/**
 * Store tokens securely - in a real app, consider using a more secure method
 * than environment variables, such as a database with encryption
 */
export function storeTokens(data: SpotifyAccessToken): void {
  // In a real production app, you would store these in a database
  // This is just a placeholder to show what values you should store
  console.log('Store these values securely:');
  console.log(`SPOTIFY_ACCESS_TOKEN=${data.access_token}`);
  console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
  console.log(`Token expires in ${data.expires_in} seconds`);
}

/**
 * Handle the callback from Spotify OAuth flow
 */
export async function handleAuthCallback(code: string): Promise<SpotifyAccessToken> {
  const tokens = await getSpotifyTokens(code);
  storeTokens(tokens);
  return tokens;
}

/**
 * Format track data for display
 */
export function formatTrackData(track: SpotifyTrackItem | null) {
  if (!track) return null;
  
  return {
    title: track.track.name,
    artist: track.track.artists.map(artist => artist.name).join(', '),
    album: track.track.album.name,
    albumArt: track.track.album.images[0]?.url,
    playedAt: new Date(track.played_at).toISOString(),
    spotifyUrl: track.track.external_urls.spotify,
    duration: Math.floor(track.track.duration_ms / 1000),
  };
}

