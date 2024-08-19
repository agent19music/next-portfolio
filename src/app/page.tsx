import BlurFade from "@/components/magicui/blur-fade";
import Sidebar from "./mycomponents/aside/page";

export default function BlurFadeTextDemo() {
  return (
    <body className="flex justify-center place-items-center">
    <section id="header" className=" mt-9">
      <BlurFade delay={0.25} inView>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
          Hello, I am Sean 👋
        </h2>
      </BlurFade>
      <BlurFade delay={0.25 * 2} inView className="my-4">
        <span className="text-md text-pretty tracking-tighter sm:text-3xl xl:text-2xl/none">
          Sofware Engineer, Designer, Weeb
        </span>
      </BlurFade >
      <BlurFade delay={0.5 *2} inView className="">
      <iframe  src="https://open.spotify.com/embed/track/1fOkmYW3ZFkkjIdOZSf596?utm_source=generator" 
      width="100%" height="270" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      </BlurFade>
      
     
     
    </section>
    </body>
  );
}
