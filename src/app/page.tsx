"use client"

import type React from "react"
import BlurFade from "@/components/magicui/blur-fade"
import { LinksDock } from "./mycomponents/dock"
import { ResumeCard } from "./mycomponents/resumecard"
import { DATA } from "./data/resume"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Markdown from "react-markdown"
import { ProjectCard } from "./mycomponents/projectcard"
import { HackathonCard } from "./mycomponents/hackathoncard"
import { EducationCard } from "./mycomponents/educationcard"
import StackedPhotoCollection from "./mycomponents/photocollection"
import { SpotifyTrack } from "@/app/mycomponents/SpotifyTrack"
import AnonymousMessageInput from "@/app/mycomponents/anonmessages"
import { ColorPaletteSelector } from "@/components/color-palette-selector"
import { useColorPalette } from "@/contexts/color-palette-context"
import Image from "next/image"

const BLUR_FADE_DELAY = 0.04

export type IconProps = React.HTMLAttributes<SVGElement>

function PortfolioContent() {
  const { currentPalette, setCurrentPalette, paletteData } = useColorPalette()

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-10 container">
      <section className="mt-9 mx-auto w-full md:max-w-2xl lg:max-w-4xl xl:max-w-6xl container ">
        <section id="header" className="mt-9 mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-2">
              <BlurFade delay={0.25} inView>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none flex" style={{ color: paletteData.text }}>
                  Hello, I&apos;m Sean 👋
                </h2>
              </BlurFade>
              <BlurFade delay={0.25 * 2} inView className="py-4">
                <span className="text-md text-pretty tracking-tighter sm:text-3xl xl:text-2xl/none" style={{ color: paletteData.secondary }}>
                  Sofware Engineer, Designer
                </span>
              </BlurFade>
              <section id="about" className="">
                <BlurFade delay={BLUR_FADE_DELAY * 3}>
                  <h2 className="text-xl font-bold pb-4" style={{ color: paletteData.text }}>About</h2>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 4}>
                  <div style={{ color: paletteData.muted }}>
                    <Markdown className="prose max-w-full text-pretty text-md dark:prose-invert">
                      {DATA.summary}
                    </Markdown>
                  </div>
                </BlurFade>
              </section>
            </div>

            <div className="lg:pl-8">
              <StackedPhotoCollection photos={[...DATA.photos]} stackSpacing={3} size="large" />
            </div>
          </div>
        </section>
        <section id="work">
          <div className="flex min-h-0 flex-col gap-y-3 mt-4">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <h2 className="text-xl font-bold" style={{ color: paletteData.text }}>Work Experience</h2>
            </BlurFade>
            {DATA.work.map((work, id) => (
              <BlurFade key={work.company} delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
                <ResumeCard
                  key={work.company}
                  logoUrl={work.logoUrl}
                  altText={work.company}
                  title={work.company}
                  subtitle={work.title}
                  href={work.href}
                  badges={work.badges}
                  period={`${work.start} - ${work.end ?? "Present"}`}
                  description={work.description}
                />
              </BlurFade>
            ))}
          </div>
        </section>
        <section id="education">
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <h2 className="text-xl font-bold" style={{ color: paletteData.text }}>Education</h2>
            </BlurFade>
            {DATA.education.map((education, id) => (
              <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 8 + id * 0.05}>
                <EducationCard
                  key={education.school}
                  href={education.href}
                  logoUrl={education.logoUrl}
                  altText={education.school}
                  title={education.school}
                  subtitle={education.degree}
                  period={`${education.start} - ${education.end}`}
                />
              </BlurFade>
            ))}
          </div>
        </section>
        <section id="skills">
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold" style={{ color: paletteData.text }}>Skills</h2>
            </BlurFade>
            <div className="flex flex-wrap gap-1">
              {DATA.skills.map((skill, id) => (
                <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                  <Badge key={skill}>
                    {skill}
                  </Badge>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
        <section id="projects">
          <div className="space-y-12 w-full py-12">
            <BlurFade delay={BLUR_FADE_DELAY * 11}>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg px-3 py-1 text-sm" style={{ 
          backgroundColor: paletteData.text,
          color: paletteData.background,
        }}>My Projects</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl" style={{ color: paletteData.text }}>Check out my latest work</h2>
                  <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed" style={{ color: paletteData.muted }}>
                    I&apos;ve worked on a variety of projects, from simple websites to complex web applications. Here
                    are a few of my favorites.
                  </p>
                </div>
              </div>
            </BlurFade>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
              {DATA.projects.map((project, id) => (
                <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 12 + id * 0.05}>
                  <ProjectCard
                    href={project.href}
                    key={project.title}
                    title={project.title}
                    description={project.description}
                    dates={project.dates}
                    tags={project.technologies}
                    image={project.image}
                    video={project.video}
                    links={project.links}
                  />
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
        <section id="hackathons">
          <div className="space-y-12 w-full py-12">
            <BlurFade delay={BLUR_FADE_DELAY * 13}>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg px-3 py-1 text-sm"  style={{ 
          backgroundColor: paletteData.text,
          color: paletteData.background,
        }}>Hackathons</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl" style={{ color: paletteData.text }}>I like building fast</h2>
                  <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed" style={{ color: paletteData.muted }}>
                    During my time in university, I attended {DATA.hackathons.length}+ hackathons. People from around
                    the country would come together and build incredible things in 2-3 days. It was eye-opening to see
                    the endless possibilities brought to life by a group of motivated and passionate individuals.
                  </p>
                </div>
              </div>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 14}>
              <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
                {DATA.hackathons.map((project, id) => (
                  <BlurFade key={project.title + project.dates} delay={BLUR_FADE_DELAY * 15 + id * 0.05}>
                    <HackathonCard
                      title={project.title}
                      description={project.description}
                      location={project.location}
                      dates={project.dates}
                      image={project.image}
                      links={project.links}
                    />
                  </BlurFade>
                ))}
              </ul>
            </BlurFade>
          </div>
        </section>
        <section id="contact">
          <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
            <BlurFade delay={BLUR_FADE_DELAY * 16}>
              <div className="space-y-3">
                <div className="inline-block rounded-lg px-3 py-1 text-sm"  style={{ 
           backgroundColor: paletteData.text,
           color: paletteData.background,
        }}>Contact</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl" style={{ color: paletteData.text }}>Get in Touch</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed" style={{ color: paletteData.secondary }}>
                  Want to chat? Just shoot me a dm{" "}
                  <Link href={DATA.contact.social.X.url} target="_blank" className="text-blue-500 hover:underline">
                    with a direct question on twitter
                  </Link>{" "}
                  and I&apos;ll respond whenever I can. I will ignore all soliciting.
                </p>
              </div>
            </BlurFade>
          </div>
        </section>
      </section>
      <footer className="py-16 mt-8">
        <BlurFade delay={0.25 * 2} inView className="flex flex-col items-center mb-12">
          <div className="inline-block rounded-lg px-3 py-1 text-sm mb-4"  style={{ 
          backgroundColor: paletteData.text,
          color: paletteData.background,
        }}>Currently Listening</div>
          <h3 className="text-xl font-bold mb-4" style={{ color: paletteData.text }}>My Latest Spotify Track</h3>
          <div className="w-[80%]">
            <SpotifyTrack />
          </div>
          <div>
            <AnonymousMessageInput />
          </div>
        </BlurFade>

        <LinksDock />
        <div className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2" style={{ color: paletteData.muted }}>
            I use Arch btw
          <Image src="https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/icons8-arch-linux-24-blue.png" alt="Description of image" width={16} height={16} />
        </div>
      </footer>

      <ColorPaletteSelector 
        currentPalette={currentPalette}
        onPaletteChange={setCurrentPalette}
      />
    </div>
  )
}

export default function BlurFadeTextDemo() {
  return <PortfolioContent />
}

