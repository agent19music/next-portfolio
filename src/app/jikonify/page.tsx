"use client";

import { Iphone } from "@/components/ui/iphone";
import { QRCodeSVG } from "qrcode.react";

export default function JikonifyPage() {
  const apkUrl = "https://pub-b8705b045735410bb811cf444c1ed133.r2.dev/jikonify.apk";
  
  const screenshots = [
    "https://pub-b8705b045735410bb811cf444c1ed133.r2.dev/jikonifyscreen1.png",
    "https://pub-b8705b045735410bb811cf444c1ed133.r2.dev/jikonifyscreen2.png",
    "https://pub-b8705b045735410bb811cf444c1ed133.r2.dev/jikonifyscreen3.png",
    "https://pub-b8705b045735410bb811cf444c1ed133.r2.dev/jikonifyscreen6.png",
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text">
            Jikonify
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your smart kitchen companion that gives you recipe recommendations. 
            Snap photos of your ingredients and get instant AI-powered recipes 
            based on what you have.
          </p>
        </div>

        {/* QR Code Section */}
        <div className="flex justify-center mb-20">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-white p-6 rounded-xl mb-4">
              <QRCodeSVG
                value={apkUrl}
                size={256}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground font-medium">
              Scan to download APK
            </p>
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-center">
            See it in action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="w-[280px] hover:scale-105 transition-transform duration-300">
                <Iphone src={screenshot} />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground">
            Available for Android devices
          </p>
        </div>
      </div>
    </main>
  );
}
