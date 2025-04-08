import { NextResponse } from 'next/server';
import { getRecentlyPlayedTrack, formatTrackData } from '@/lib/spotify/spotify-service';

// Cache structure
interface CachedTrack {
  data: any;
  timestamp: number;
}

// In-memory cache (consider Redis or another solution for production)
let trackCache: CachedTrack | null = null;

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Check if the cache is valid
 */
function isCacheValid(): boolean {
  if (!trackCache) return false;
  
  const now = Date.now();
  return now - trackCache.timestamp < CACHE_DURATION;
}

/**
 * GET handler for the /api/spotify route
 * Returns the cached track or fetches a new one if needed
 */
export async function GET() {
  try {
    // Return cached data if valid
    if (isCacheValid() && trackCache) {
      console.log('Returning cached Spotify track data');
      return NextResponse.json(trackCache.data);
    }

    // Fetch new data
    console.log('Fetching fresh Spotify track data');
    const track = await getRecentlyPlayedTrack();
    const formattedTrack = formatTrackData(track);

    if (!formattedTrack) {
      return NextResponse.json(
        { error: 'No recently played tracks found' },
        { status: 404 }
      );
    }

    // Update cache
    trackCache = {
      data: formattedTrack,
      timestamp: Date.now(),
    };

    return NextResponse.json(formattedTrack);
  } catch (error) {
    console.error('Error in Spotify API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Spotify track data' },
      { status: 500 }
    );
  }
}

/**
 * Force refresh the cache by adding ?refresh=true to the request
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    if (!forceRefresh && isCacheValid() && trackCache) {
      return NextResponse.json(trackCache.data);
    }

    // Fetch new data
    const track = await getRecentlyPlayedTrack();
    const formattedTrack = formatTrackData(track);

    if (!formattedTrack) {
      return NextResponse.json(
        { error: 'No recently played tracks found' },
        { status: 404 }
      );
    }

    // Update cache
    trackCache = {
      data: formattedTrack,
      timestamp: Date.now(),
    };

    return NextResponse.json(formattedTrack);
  } catch (error) {
    console.error('Error in Spotify API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Spotify track data' },
      { status: 500 }
    );
  }
}

