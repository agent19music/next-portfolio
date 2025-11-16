"use client"

import BlurFade from "@/components/magicui/blur-fade"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ClientTweetCard } from "@/components/ui/client-tweet-card"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

const BLUR_FADE_DELAY = 0.04

// Placeholder data - you'll fill this in with actual usernames and profile URLs
const winners = [
  {
    id: 1,
    username: "@zazimane",
    name: "Zazi | ザジ🍀",
    profileUrl: "https://x.com/zazimane",
    avatar: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/twtmillionaires/zazimanepfp.jpg",
  },
  {
    id: 2,
    username: "@misterr_jackson",
    name: "¿wusyaname?",
    profileUrl: "https://x.com/misterr_jackson",
    avatar: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/twtmillionaires/mjpfp.jpg",
  },
  {
    id: 3,
    username: "@jabber_wonger_",
    name: "yvonne 🦄",
    profileUrl: "https://x.com/jabber_wonger_",
    avatar: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/twtmillionaires/ivypfp.jpg",
  },
  {
    id: 4,
    username: "@sehrerfolgreich",
    name: "Natasha",
    profileUrl: "https://x.com/sehrerfolgreich",
    avatar: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/twtmillionaires/tashpfp.jpg",
  },
  {
    id: 5,
    username: "@badlikerihh",
    name: "baddiemann3rs💋",
    profileUrl: "https://x.com/badlikerihh",
    avatar: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/twtmillionaires/baddiemannerspfp.jpg",
  },
]

export default function TwtMillionairesPage() {
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation for Kenyan phone number (starts with 254 or 07/01)
    const phoneRegex = /^(?:254|\+254|0)?[71]\d{8}$/
    
    if (phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      toast.error("Why are you this gullible? 😭", {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      })
      setPhoneNumber("")
    } else {
      toast.error("Please enter a valid Kenyan phone number", {
        duration: 3000,
      })
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-col min-h-[100dvh] space-y-10 container">
        <section className="mt-9 mx-auto w-full md:max-w-2xl lg:max-w-4xl container">
        {/* Header Section */}
        <section id="header" className="mt-9 mx-auto">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-center" style={{ color: 'var(--text)' }}>
              Congratulations! 🎉
            </h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <p className="text-md text-center tracking-tighter sm:text-xl py-4" style={{ color: 'var(--secondary)' }}>
              The first five to reply are now millionaires!*
            </p>
          </BlurFade>
        </section>

        {/* Tweet Card */}
        <section id="tweet" className="mt-8">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="flex justify-center">
              <ClientTweetCard id="1989598218749981055" />
            </div>
          </BlurFade>
        </section>

        {/* M-Pesa Claim Section */}
        <section id="claim" className="mt-12">
          <BlurFade delay={BLUR_FADE_DELAY * 3.5}>
            <Card className="max-w-md mx-auto" style={{ borderColor: 'var(--muted)', backgroundColor: 'var(--background)' }}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                  Claim Your Prize! 💰
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
                  First send processing fee of KES 5,000 to claim your 1,000,000 KES prize!
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text)' }}>
                      Enter your M-Pesa number:
                    </label>
                    <Input
                      type="tel"
                      placeholder="0712345678 or 254712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full"
                      style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}
                    />
                  </div>
                  <Button type="submit" className="w-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--background)' }}>
                    Submit & Claim Prize
                  </Button>
                </form>
              </CardContent>
            </Card>
          </BlurFade>
        </section>

        {/* Winners List */}
        <section id="winners" className="mt-12">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold mb-8 text-center" style={{ color: 'var(--text)' }}>
              The Lucky Five
            </h2>
          </BlurFade>
          
          <div className="space-y-8 max-w-2xl mx-auto">
            {winners.map((winner, id) => (
              <BlurFade key={winner.id} delay={BLUR_FADE_DELAY * 6 + id * 0.15}>
                <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <Avatar className="border size-16">
                    <AvatarImage src={winner.avatar} alt={winner.name} className="object-cover" />
                    <AvatarFallback>{winner.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <a
                      href={winner.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-lg hover:underline block"
                      style={{ color: 'var(--text)' }}
                    >
                      {winner.name}
                    </a>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>
                      {winner.username}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                      #{winner.id}
                    </div>
                    <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                      1M KES
                    </div>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </section>
      </section>

      {/* Footer with disclaimer */}
      <footer className="py-16 mt-8 text-muted">
        <div className="text-center text-sm max-w-2xl mx-auto px-4" style={{ color: 'var(--muted)' }}>
          <p className="mb-2 ">
            * This is all for gags, vibes, and comedic purposes only. No actual money, prizes, rewards, 
            or any form of compensation will be transferred, sent, wired, or delivered to anyone. 
          </p>
          <p className="mb-2">
            This is not a legitimate giveaway, contest, lottery, or financial transaction of any kind. 
            If you actually thought you were getting a million shillings for replying to a tweet about 
            fit pics, we need to have a serious conversation about internet literacy.
          </p>
          <p className="italic">
            Please don&apos;t send me money. Please don&apos;t ask me for money. This is purely satire. 
            I repeat: THIS IS SATIRE. No MPesa. No nothing. Just jokes.😭
          </p>
        </div>
      </footer>
      </div>
    </>
  )
}
