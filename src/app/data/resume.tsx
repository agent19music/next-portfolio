import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Dillion Verma",
  initials: "DV",
  url: "https://dillion.io",
  location: "Nairobi, KE",
  locationLink: "https://www.google.com/maps/place/sanfrancisco",
  description:
    "Software Engineer. I love building things and helping people.",
  summary:
    "I am a 20-year-old full-stack web developer and computer science student, with a certificate in software engineering. I have a passion for building innovative and efficient web applications. In addition to my technical skills, I have a deep appreciation for music, which fuels my creativity and drive.",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Node.js",
    "Python",
    "Postgres",
    "Docker",
   
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "seanmotanya@gmail.com",
    tel: "+254 745 071 299",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/agent19music",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/sean-motanya/",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/ufwsean",
        icon: Icons.x,

        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,

        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Vitapharm Health",
      href: "https://vitapharmcosmetics.co.ke",
      badges: [],
      location: "Hybrid",
      title: "Frontend Software Engineer",
      logoUrl: "/vitapharmlogo.png",
      start: "April 2024",
      end: "date",
      description:
        "Implemented the Bitcoin discreet log contract (DLC) protocol specifications as an open source Typescript SDK. Dockerized all microservices and setup production kubernetes cluster. Architected a data lake using AWS S3 and Athena for historical backtesting of bitcoin trading strategies. Built a mobile app using react native and typescript.",
    },
    {
      company: "E-Kommerce Ltd",
      href: "https://mitremedia.com/",
      badges: [],
      location: "Toronto, ON",
      title: "Full Stack Software Engineer",
      logoUrl: "/mitremedia.png",
      start: "June 2024",
      end: "date",
      description:
        "Designed and implemented a robust password encryption and browser cookie storage system in Ruby on Rails. Leveraged the Yahoo finance API to develop the dividend.com equity screener",
    },
  ],
  education: [
    {
      school: "Moringa School",
      href: "https://moringaschool.com",
      degree: "Certificate in Software Engineering",
      logoUrl: "/moringalogo.jpeg",
      start: "2023",
      end: "2024",
    },
    {
      school: "Riara University",
      href: "https://riarauniversity.ac.ke",
      degree: "Bachelor's Degree of Computer Science (BCS)",
      logoUrl: "/rulogo.jpg",
      start: "2021",
      end: "2025",
    }
  ],
  projects: [
    {
      title: "Vitapharm cosmetics",
      href: "https://chatcollect.com",
      dates: "Apr 2024 - Aug 2024",
      active: true,
      description:
        "With the release of the [OpenAI GPT Store](https://openai.com/blog/introducing-the-gpt-store), I decided to build a SaaS which allows users to collect email addresses from their GPT users. This is a great way to build an audience and monetize your GPT API usage.",
      technologies: [
        "React.js",
        "Javascript",
        "MySQL",
        "Flask",
        "TailwindCSS",
        "Chakra UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://vitapharmcosmetics.co.ke/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/vitapharm.mp4",
    },
    {
      title: "Magic UI",
      href: "https://magicui.design",
      dates: "June 2023 - Present",
      active: true,
      description:
        "Designed, developed and sold animated UI components for developers.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://magicui.design",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/magicuidesign/magicui",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "https://cdn.magicui.design/bento-grid.mp4",
    }
  ],
  hackathons: [
    {
      title: "Naiccon Afrofuturisic Game Hackathon",
      dates: "November 18h - 19th, 2023",
      location: "Nairobi, Kenya",
      description:
        "Developed a web based anime quiz bowl game application with a bingwa points award system and weekly leaderboards.",
      image:
        "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/naicconlogo.jpg",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
    {
      title: "A2SV AI for Impact in Africa",
      dates: "July 26th - 31st, 2024",
      location: "Nairobi, Kenya",
      description:
        "Developed a mental wellness web application which helps streamline learning by providing links to tutorials and also a place to bond over common interests like music and movies.",
      image:
        "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/a2svlogo.jpeg",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    }

  ],
} as const;
