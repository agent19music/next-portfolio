import React from 'react';
import dynamic from 'next/dynamic';
import { Github, Link } from 'lucide-react';

// Dynamically import the HackathonCard component
const HackathonCard = dynamic(() => import('@/components/ui/hackathon-card').then(mod => mod.HackathonCard), {
  loading: () => <div>Loading Hackathon Card...</div>,
});

// Example hackathon data
const exampleHackathon = {
  title: "TechCrunch Disrupt Hackathon",
  description: "Built an AI-powered solution for remote team collaboration, winning first place in the productivity category.",
  dates: "October 15-17, 2023",
  location: "San Francisco, CA",
  image: "/images/hackathon-logo.png",
  links: [
    {
      icon: <Github className="h-4 w-4" />,
      title: "GitHub",
      href: "https://github.com/username/project"
    },
    {
      icon: <Link className="h-4 w-4" />,
      title: "Demo",
      href: "https://demo-url.com"
    }
  ]
};

export const metadata = {
  title: 'Hackathon Showcase',
  description: 'Displaying my hackathon participation and achievements',
};

export default function HackathonPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Hackathon Showcase</h1>
      <ul>
        <HackathonCard {...exampleHackathon} />
      </ul>
    </div>
  );
}
