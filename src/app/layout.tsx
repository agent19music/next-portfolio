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
    default: "Sean Motanya - Full Stack Software Developer",
    template: `%s | Sean Motanya`,
  },
  description: "Full Stack Software Developer specializing in React, Next.js, Python, and modern web technologies. Building beautiful and efficient applications that serve humanity.",
  keywords: [
    "Sean Motanya",
    "Software Engineer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer",
    "Portfolio",
    "Nairobi",
    "Kenya",
    "Flask",
    "Tailwind CSS",
    "Node.js",
    "Software Engineering"
  ],
  authors: [
    {
      name: "Sean Motanya",
      url: DATA.url,
    },
  ],
  creator: "Sean Motanya",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: DATA.url,
    title: "Sean Motanya - Full Stack Software Developer",
    description: "Full Stack Software Developer specializing in React, Next.js, Python, and modern web technologies. Building beautiful and efficient applications that serve humanity.",
    siteName: "Sean Motanya Portfolio",
    images: [
      {
        url: "/sean-avatar-og.png",
        width: 1200,
        height: 630,
        alt: "Sean Motanya - Full Stack Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sean Motanya - Full Stack Software Developer",
    description: "Full Stack Software Developer specializing in React, Next.js, Python, and modern web technologies. Building beautiful and efficient applications that serve humanity.",
    site: "@ufwsean",
    creator: "@ufwsean",
    images: ["/sean-avatar-og.png"],
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
