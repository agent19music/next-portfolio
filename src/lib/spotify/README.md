# Spotify Integration for Next.js

This Spotify integration allows you to display your most recently played Spotify tracks on your Next.js website with real-time updates for visitors without requiring page refreshes.

## Features

- 🎵 Display your most recently played Spotify track
- 🔄 Real-time updates using SWR
- 🔒 Secure token handling with automatic refresh
- 📱 Responsive design with album artwork
- ⚡ Optimized for performance with caching

## Prerequisites

- A Spotify account
- A registered Spotify application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
- Node.js and npm/yarn installed

## Setup Instructions

### 1. Create a Spotify Application

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Log in with your Spotify account
3. Click on "Create an App"
4. Fill in the app name and description
5. Once created, click on "Edit Settings"
6. Add a Redirect URI: `http://localhost:8888/callback` 
7. Save the changes
8. Note down your Client ID and Client Secret from the dashboard

### 2. Configure Environment Variables

Add the following variables to your existing `.env` file:

```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=will_be_filled_by_setup_script
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
```

### 3. Run the Setup Script

The setup script will guide you through the Spotify OAuth process to generate your initial refresh token:

```bash
# Make sure you have ts-node installed
npm install -g ts-node typescript

# Run the setup script
npx ts-node scripts/setup-spotify.ts
```

Follow the prompts:
1. The script will generate a URL for you to open in your browser
2. Log in to Spotify and authorize your application
3. You will be redirected back to your application
4. The script will automatically extract the refresh token and update your `.env` file

### 4. Add the SpotifyTrack Component to Your Page

Import and add the SpotifyTrack component to any page where you want to display your recently played track:

```tsx
// In your page or component file
import SpotifyTrack from '@/components/ui/SpotifyTrack';

export default function YourPage() {
  return (
    <div>
      <h1>My Page</h1>
      
      {/* Add the Spotify Track component */}
      <SpotifyTrack />
      
      {/* Rest of your page content */}
    </div>
  );
}
```

## Customization

### Styling

The SpotifyTrack component uses Tailwind CSS classes by default. You can customize its appearance by modifying the component directly or by wrapping it with your own styled container.

### Refresh Interval

By default, the component checks for new tracks every 30 seconds. You can customize this by passing a `refreshInterval` prop:

```tsx
<SpotifyTrack refreshInterval={60000} /> {/* Check every minute */}
```

### Display Options

You can customize what information is displayed by passing optional props:

```tsx
<SpotifyTrack 
  showAlbumArt={true}
  showArtist={true}
  showTrackName={true}
  showPlayingStatus={true}
/>
```

## How It Works

1. The Spotify service authenticates with the Spotify API using your client credentials and refresh token
2. The API route (`/api/spotify/route.ts`) fetches and caches your most recently played track
3. The SpotifyTrack component uses SWR to fetch data from the API and automatically updates when new data is available
4. Token refresh happens automatically in the background when needed

## Troubleshooting

### Token Refresh Issues

If you encounter authentication issues:

1. Re-run the setup script to generate a new refresh token
2. Verify that your Client ID and Client Secret are correct in your `.env` file
3. Check that the redirect URI in your Spotify app settings matches exactly `http://localhost:8888/callback`

### API Rate Limits

The Spotify API has rate limits. The integration includes caching to minimize API calls, but if you hit rate limits:

1. Increase the cache duration in `src/app/api/spotify/route.ts`
2. Increase the refresh interval of the SpotifyTrack component

### Component Not Updating

If the component is not updating in real-time:

1. Make sure SWR is configured correctly
2. Check for network errors in your browser console
3. Verify that the API route is returning fresh data

## Deployment to Vercel

When deploying to Vercel:

1. Add all environment variables in the Vercel project settings
2. Make sure to run the setup script locally first to generate your refresh token
3. Add the refresh token to your Vercel environment variables

## License

This Spotify integration is open-source and available under the MIT License.

## Credits

This integration was built using:
- Next.js API Routes
- SWR for data fetching and caching
- Spotify Web API

