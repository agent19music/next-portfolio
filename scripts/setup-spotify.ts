#!/usr/bin/env ts-node
import express from 'express';
import axios from 'axios';
import open from 'open';
import { createInterface } from 'readline';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { URLSearchParams } from 'url';

// Load existing environment variables
dotenv.config({ path: '.env.local' });

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt user for input
const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
};

// Function to update .env.local file
const updateEnvFile = (data: Record<string, string>) => {
  const envFilePath = '.env.local';
  let envContent = '';

  // Read existing file if it exists
  if (existsSync(envFilePath)) {
    envContent = require('fs').readFileSync(envFilePath, 'utf8');
  }

  // Update or add new variables
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }

  // Write the updated content back to the file
  writeFileSync(envFilePath, envContent.trim() + '\n');
  console.log(`✅ Updated ${envFilePath} with new values`);
};

// Main authentication function
async function authenticateWithSpotify() {
  console.log('🎵 Spotify API Setup\n');
  console.log('This script will help you set up Spotify API authentication for your Next.js application.');
  console.log('\nFirst, you need to create a Spotify application in the Spotify Developer Dashboard:');
  console.log('1. Go to https://developer.spotify.com/dashboard/');
  console.log('2. Log in with your Spotify account');
  console.log('3. Click "Create App"');
  console.log('4. Fill in the application details');
  console.log('   - App name: [Your app name]');
  console.log('   - App description: [Your app description]');
  console.log('   - Website: http://localhost:3000 (local) or https://seanmotanya.dev (production)');
  console.log('   - Redirect URI: http://localhost:8888/callback');
  console.log('      ⚠️ IMPORTANT: You MUST add this exact redirect URI to your Spotify Developer Dashboard');
  console.log('      ⚠️ The "Invalid redirect URI" error occurs when this URI doesn\'t exactly match');
  console.log('      ⚠️ Note: This is different from your app URL (which runs on port 3000 locally)');
  console.log('5. Accept the terms and click "Create"');
  console.log('6. Once created, you\'ll see your Client ID on the dashboard');
  console.log('7. Click "Show Client Secret" to reveal your Client Secret\n');

  // Get credentials from user input or environment variables
  const clientId = process.env.SPOTIFY_CLIENT_ID || await prompt('Enter your Spotify Client ID: ');
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || await prompt('Enter your Spotify Client Secret: ');

  if (!clientId || !clientSecret) {
    console.error('❌ Client ID and Client Secret are required');
    process.exit(1);
  }

  // Define the redirect URI and server port
  // This is different from your Next.js app which runs on port 3000 locally and seanmotanya.dev in production
  const redirectUri = 'http://localhost:8888/callback';
  const port = 8888;
  
  // Set up Express server to handle the callback
  const app = express();
  let server: any;

  // Define the scopes we want to request from Spotify
  const scope = 'user-read-recently-played user-read-currently-playing user-read-playback-state';

  return new Promise<void>((resolve, reject) => {
    // Callback route
    app.get('/callback', async (req, res) => {
      try {
        const code = req.query.code as string;
        
        if (!code) {
          throw new Error('Authorization code not received');
        }

        // Exchange the code for access and refresh tokens
        const tokenResponse = await axios({
          method: 'post',
          url: 'https://accounts.spotify.com/api/token',
          data: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
          }).toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          },
        });

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        // Update environment variables
        updateEnvFile({
          SPOTIFY_CLIENT_ID: clientId,
          SPOTIFY_CLIENT_SECRET: clientSecret,
          SPOTIFY_REFRESH_TOKEN: refresh_token,
        });

        // Close the server
        server.close();

        // Display success message to the user
        res.send(`
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1DB954;">Authentication Successful!</h1>
              <p>Your Spotify refresh token has been saved.</p>
              <p>You can now close this window and return to your terminal.</p>
            </body>
          </html>
        `);

        console.log('\n✅ Authentication successful!');
        console.log(`✅ Refresh token has been saved to .env.local`);
        console.log('\nYou can now use the Spotify API in your application.');
        
        resolve();
      } catch (error) {
        console.error('❌ Error during token exchange:', error);
        res.status(500).send('Authentication failed. Please check the console for more details.');
        reject(error);
      }
    });

    // Start the server
    server = app.listen(port, async () => {
      console.log(`\nStarting authentication process...`);
      
      // Construct the authorization URL
      const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope,
        redirect_uri: redirectUri,
      }).toString()}`;

      console.log(`\nOpening browser to authorize the application...`);
      
      // Open the authorization URL in the default browser
      await open(authUrl);
      
      console.log('\nWaiting for authorization...');
    });
  });
}

// Make sure the scripts directory exists
const scriptsDir = join(process.cwd(), 'scripts');
if (!existsSync(scriptsDir)) {
  console.log('Creating scripts directory...');
  mkdirSync(scriptsDir);
}

// Run the authentication process
authenticateWithSpotify()
  .then(() => {
    rl.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Authentication failed:', error);
    rl.close();
    process.exit(1);
  });

