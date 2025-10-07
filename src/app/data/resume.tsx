import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Sean Motanya",
  initials: "SM",
  url: "https://seanmotanya.dev",
  location: "Nairobi, KE",
  locationLink: "https://www.google.com/maps/place/nairobi",
  description:
    "Software Developer. I love building beautiful and efficient things that serve humanity.",
  summary:
    "I am a full-stack  developer and recent computer science graduate. I'm intrested in  building innovative and impactful applications. I also like music and gaming.",
  skills: [
    "Python",
    "Typescript",
    "Kotlin",
    "PHP",
    "Figma",
    "Next.js",
    "Docker",
    "Flask",
    "React Native",
    "Laravel",
    
   
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
        url: "https://x.com/uzski404",
        icon: Icons.x,

        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:seanmotanya@gmail.com",
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
      end: "August 2024",
      description:
        "Developed a web-based application and an accompanying admin dashboard for Vitapharm Health, a cosmetics company, using React.js and Tailwind CSS. The application features a user-friendly interface for managing product inventory and customer orders.",
    },
    {
      company: "Freelance",
      href: "https://www.upwork.com/freelancers/~01a2b3c4d5e6f7g8h9",
      badges: [],
      location: "Nairobi, KE",
      title: "Full Stack Software Engineer",
      logoUrl: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/upwork-logo.png",
      start: "June 2024",
      end: "present",
      description: "Worked as a freelance software engineer, specializing in full-stack development. Collaborated with clients to design and implement custom web applications, focusing on user experience and performance optimization. Additionally, dedicated significant time to challenging personal projects, which served to deepen tool knowledge and enhance problem-solving skills."
      },
      {
      company: "Lixnet Technologies",
      href: "https://lixnet.net",
      badges: [],
      location: "Remote",
      title: "Backend Software Engineer",
      logoUrl: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/lixnet%20logo.jpeg",
      start: "May 2025",
      end: "June 2025",
      description:
      "Currently working as a Backend Software Engineer at Lixnet Technologies where I am responsible for developing their payroll management system. My role involves designing and implementing robust backend solutions to ensure efficient payroll processing and management for clients.",
    },
    {
      company: "Daraja Plus",
      href: "https://darajaplus.com",
      badges: [],
      location: "Hybrid",
      title: "Full Stack Software Engineer ",
      logoUrl: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/darajapluslogo.jpg",
      start: "June 2024",
      end: "present",
      description:"Built the backend for a brand ambassador sales tracking tool, handling data integration with existing systems. Developed a kitchen companion app with AI recipe suggestions, meal planning, and pantry management features, plus an admin dashboard for analytics. Delivered two working applications that improved sales tracking operations and provided users with a complete kitchen management solution."
    }
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
      degree: "Bachelor's Degree in Computer Science (BCS)",
      logoUrl: "/rulogo.jpg",
      start: "2021",
      end: "2025",
    }
  ],
  projects: [
    {
      title: "Vitapharm cosmetics",
          href: "https://github.com/agent19music/vitapharm-client",
      dates: "Apr 2024 - Aug 2024",
      active: true,
      description:
      "Developed a web-based application and an accompanying admin dashboard for Vitapharm Health, a cosmetics company, using React.js and Tailwind CSS. The application features a user-friendly interface for managing product inventory and customer orders.",
      technologies: [
        "React.js",
        "MySQL",
        "Flask",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/agent19music/vitapharm-client",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/vitapharm.mp4",
    },

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
      links: [],
    },
    {
      title: "A2SV AI for Impact in Africa",
      dates: "July 26th - 31st, 2024",
      location: "Nairobi, Kenya",
      description:
        "Developed a mental wellness web application that  streamlines learning by easing access to material, providing a place to bond over common interests like music and film.",
      image:
        "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/a2svlogo.jpeg",
      links: [],
    },
    {
      title: "Anza Village Design Thinking Hackathon",
      dates: "November 15th - 17th 2024",
      location: "Nairobi, Kenya",
      description:"Developed a secure ticket management system that eliminates unauthorized transfers and prevents revenue loss from resale fraud, while delivering an intuitive, visually striking user interface for enhanced customer experience.",
      image:
        "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/logo_anzavillage.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
    
    {
      title: "DeKuT Idea to Business Innovation Weekend",
      dates: "May 23rd - 24th 2025",
      location: "Nyeri, Kenya",
      description:"Presented the winning healthcare accessibility application that connects vulnerable patients like the elderly and disabled with healthcare providers, ensuring they receive timely medical attention.",
      image:
        "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/i2B-LOGO.png",
      links: [],
    },
    {
      title: "Walumo and Moringa School Hackathon",
      dates: "July 1st - 4th, 2025",
      location: "Nairobi, Kenya",
      description: "Developed an AI powered HR management system that streamlines and automates hiring talent, employee management, and payroll processing",
      image:
        "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/FB_IMG_1753166941314.jpg",
      links: [
        // {
        //   type: "Website",
        //   href: "https://www.zentiri.app/",
        //   icon: <Icons.globe className="size-3" />,
        // },
      ],
    },

  ],
  photos:  [
    {
      id: 1,
      src: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/canva/seanmotanyaatthedubaimiraclegarden.png",
      alt: "Dubai Miracle Garden",
      caption: "Me at the Dubai Miracle Garden, 2024"
    },
    {
      id: 2,
      src: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/canva/seanmotanyaathismoringaschoolgraduation.png",
      alt: "Moringa School Graduation",
      caption: "Me at the Moringa School Graduation, 2024"
    },
    {
      id: 3,
      src: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/canva/seanmotanyaatthedubaidesertsafari.png",
      alt: "Dubai Desert Safari",
      caption: "Me at the Dubai Desert Safari, 2024"
    },
    {
      id: 4,
        src: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/canva/seanmotanyaattheolooluanaturetrail.png",
        alt: "Oloolua Nature Trail",
        caption: "Me at the Oloolua Nature Trail, 2025"
      },
    
  ],

} as const;
