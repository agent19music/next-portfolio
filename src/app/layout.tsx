import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import {GoogleAnalytics} from "@next/third-parties/google";
import { ColorPaletteProvider } from "@/contexts/color-palette-context";
import { DynamicThemeProvider } from "@/components/dynamic-theme-provider";
import { DATA } from "./data/resume";
import { StructuredData } from "@/components/structured-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: DATA.name,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  keywords: [
    "Sean Motanya",
    "Software Engineer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer",
    "Portfolio",
    "Nairobi",
    "Kenya"
  ],
  authors: [
    {
      name: DATA.name,
      url: DATA.url,
    },
  ],
  creator: DATA.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: DATA.url,
    title: DATA.name,
    description: DATA.description,
    siteName: DATA.name,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(DATA.name)}&description=${encodeURIComponent(DATA.description)}`,
        width: 1200,
        height: 630,
        alt: `${DATA.name} - ${DATA.description}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DATA.name,
    description: DATA.description,
    site: "@ufwsean", // Your Twitter handle from the resume data
    creator: "@ufwsean",
    images: [`/api/og?title=${encodeURIComponent(DATA.name)}&description=${encodeURIComponent(DATA.description)}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
       </head>
      <body className={inter.className}>
        <ColorPaletteProvider>
          <DynamicThemeProvider>
            {children}
          </DynamicThemeProvider>
        </ColorPaletteProvider>
         <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID!} />
        <Analytics />
          <SpeedInsights
          />
       
      </body>
    </html>
  );
}
