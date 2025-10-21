"use client"

import type React from "react"
import { useState } from "react"
import BlurFade from "@/components/magicui/blur-fade"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import supabase from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

const BLUR_FADE_DELAY = 0.04

export default function WAGSPage() {
  const [formData, setFormData] = useState({
    name: "",
    instagram: "",
    favouriteClub: "",
    age: "",
    rateCard: "",
    note: "",
  })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      const instagramHandle = formData.instagram.trim()

      if (!formData.name || !instagramHandle || !formData.favouriteClub || !formData.age || !formData.rateCard) {
        setErrorMessage("Please fill in all required fields")
        setLoading(false)
        return
      }

      const age = parseInt(formData.age, 10)
      if (isNaN(age) || age < 1 || age > 150) {
        setErrorMessage("Please enter a valid age")
        setLoading(false)
        return
      }

      const rateCardValue = parseInt(formData.rateCard, 10)
      if (isNaN(rateCardValue) || rateCardValue < 1) {
        setErrorMessage("Please enter a valid daily rate in KSH")
        setLoading(false)
        return
      }

      let instagramColumn: "instagram" | "instagram_username" = "instagram"
      let existingRecord: unknown | null = null

      const { data: existingByInstagram, error: instagramCheckError } = await supabase
        .from("wags")
        .select("id")
        .eq("instagram", instagramHandle)
        .maybeSingle()

      if (instagramCheckError) {
        if (instagramCheckError.code === "PGRST116") {
          setErrorMessage("Uh oh someone already gave us that instagram")
          setLoading(false)
          return
        }

        if (instagramCheckError.message?.toLowerCase().includes('column "instagram"')) {
          instagramColumn = "instagram_username"

          const { data: existingByUsername, error: usernameCheckError } = await supabase
            .from("wags")
            .select("id")
            .eq("instagram_username", instagramHandle)
            .maybeSingle()

          if (usernameCheckError) {
            if (usernameCheckError.code === "PGRST116") {
              setErrorMessage("Uh oh someone already gave us that instagram")
            } else {
              console.error("Supabase username check error:", usernameCheckError)
              setErrorMessage("Unable to verify Instagram uniqueness right now. Please try again.")
            }
            setLoading(false)
            return
          }

          existingRecord = existingByUsername
        } else {
          console.error("Supabase instagram check error:", instagramCheckError)
          setErrorMessage("Unable to verify Instagram uniqueness right now. Please try again.")
          setLoading(false)
          return
        }
      } else {
        existingRecord = existingByInstagram
      }

      if (existingRecord) {
        setErrorMessage("Uh oh someone already gave us that instagram")
        setLoading(false)
        return
      }

      const { error } = await supabase.from("wags").insert([
        {
          name: formData.name,
          favourite_football_club: formData.favouriteClub,
          age,
          rate_card: rateCardValue,
          note: formData.note || null,
          created_at: new Date().toISOString(),
          [instagramColumn]: instagramHandle,
        },
      ])

      if (error) {
        console.error("Supabase error:", error)
        setErrorMessage(error.message || "Failed to register. Please try again.")
        setLoading(false)
        return
      }

      // Success
      setSuccessMessage("🎉 Yaay, you're registered! Thank you for applying to be my Mootball WAG!")
      setFormData({
        name: "",
        instagram: "",
        favouriteClub: "",
        age: "",
        rateCard: "",
        note: "",
      })
    } catch (err) {
      console.error("Error:", err)
      setErrorMessage("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-10 bg-charcoal text-white">
      <section className="mt-9 mx-auto w-full md:max-w-2xl lg:max-w-4xl xl:max-w-6xl container">
        {/* Header Section */}
        <section id="header" className="mt-9 mx-auto">
          <BlurFade delay={BLUR_FADE_DELAY} inView>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 text-white">
              Be my WAG !!l ⚽
            </h1>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 2} inView>
            <p className="text-lg md:text-xl mb-8 max-w-2xl text-white/80">
            Fill this out for a chance to be my WAG for Mootball !!
            <Image
                src="https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/uzski_hearteyes-removebg-preview.png" 
                alt="Sean" 
                width={40} 
                height={40} 
                className="inline-block" 
              />
            </p>
          </BlurFade>
        </section>

        {/* Form Section */}
        <section id="registration-form" className="mt-12 mb-12">
          <BlurFade delay={BLUR_FADE_DELAY * 3} inView>
            <Card className="w-full bg-charcoal border border-white/10">
              <CardContent className="p-6 md:p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-white">
                      First Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="What's your first name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-white/20 bg-charcoal text-white placeholder:text-gray-400 focus-visible:ring-white/40 focus-visible:ring-offset-charcoal"
                    />
                  </div>

                  {/* Instagram Username Field */}
                  <div className="space-y-2">
                    <label htmlFor="instagram" className="block text-sm font-medium text-white">
                      Instagram Username
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-white">@</span>
                      <Input
                        id="instagram"
                        name="instagram"
                        type="text"
                        placeholder="yourusername"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full border border-white/20 bg-charcoal text-white placeholder:text-gray-400 focus-visible:ring-white/40 focus-visible:ring-offset-charcoal"
                      />
                    </div>
                  </div>

                  {/* Favourite Football Club Field */}
                  <div className="space-y-2">
                    <label htmlFor="favouriteClub" className="block text-sm font-medium text-white">
                      Favourite Football Club
                    </label>
                    <Input
                      id="favouriteClub"
                      name="favouriteClub"
                      type="text"
                      placeholder="e.g., Man United"
                      value={formData.favouriteClub}
                      onChange={handleChange}
                      className="w-full border border-white/20 bg-charcoal text-white placeholder:text-gray-400 focus-visible:ring-white/40 focus-visible:ring-offset-charcoal"
                    />
                  </div>

                  {/* Age Field */}
                  <div className="space-y-2">
                    <label htmlFor="age" className="block text-sm font-medium text-white">
                      Age
                    </label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      min="1"
                      max="150"
                      placeholder="How old are you ?"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full border border-white/20 bg-charcoal text-white placeholder:text-gray-400 focus-visible:ring-white/40 focus-visible:ring-offset-charcoal"
                    />
                  </div>

                  {/* Rate Card Field */}
                  <div className="space-y-2">
                    <label htmlFor="rateCard" className="block text-sm font-medium text-white">
                      Rate Card (KSH per day)
                    </label>
                    <Input
                      id="rateCard"
                      name="rateCard"
                      type="number"
                      min="1"
                      placeholder="1500 KSH for the day"
                      value={formData.rateCard}
                      onChange={handleChange}
                      className="w-full border border-white/20 bg-charcoal text-white placeholder:text-gray-400 focus-visible:ring-white/40 focus-visible:ring-offset-charcoal"
                    />
                  </div>

                  {/* Note Field */}
                  <div className="space-y-2">
                    <label htmlFor="note" className="block text-sm font-medium text-white">
                      Note (optional)
                    </label>
                    <Textarea
                      id="note"
                      name="note"
                      placeholder="Anything else you want to share?"
                      value={formData.note}
                      onChange={handleChange}
                      colorScheme="monochrome"
                      className="border border-white/30 focus-visible:ring-white/40 focus-visible:ring-offset-charcoal"
                    />
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="p-4 rounded-lg text-sm border border-red-500/40 bg-red-500/10 text-red-200">
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 text-base font-semibold rounded-lg transition-all duration-200 hover:shadow-lg border border-white/20 bg-white text-charcoal hover:bg-gray-200"
                    >
                      {loading ? "Registering..." : "Register Now"}
                    </Button>
                  </div>

                  {/* Footer Text */}
                  <div className="text-center text-sm mt-6 text-white/70">
                    <p>
                      Questions?{" "}
                      <Link href="https://www.x.com/ufwsean" target="_blank" className="underline font-medium hover:opacity-80">
                        Get in touch
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </BlurFade>
        </section>

        {/* Info Section */}
        <section id="info" className="mt-16 mb-12">
          <BlurFade delay={BLUR_FADE_DELAY * 4} inView>
            <div className="rounded-lg p-6 md:p-8 bg-charcoal border border-white/10">
              <p className="text-sm md:text-base leading-relaxed text-white/80">
                Your information is safe with me. I use your data only to check you out and reach out with an offer if you qualify.
              </p>
            </div>
          </BlurFade>
        </section>
      </section>

      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md bg-charcoal/95 shadow-2xl">
            <CardContent className="flex flex-col items-center space-y-6 p-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-400" />
              <p className="text-lg font-semibold text-white">
                {successMessage}
              </p>
              <Button
                type="button"
                onClick={() => setSuccessMessage("")}
                className="px-6 bg-emerald-500 text-charcoal hover:bg-emerald-400"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
