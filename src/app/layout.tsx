import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import {GoogleAnalytics} from "@next/third-parties/google";
import { ColorPaletteProvider } from "@/contexts/color-palette-context";
import { DynamicThemeProvider } from "@/components/dynamic-theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sean Motanya",
  description: "My personal portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
