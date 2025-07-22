import { DATA } from "@/app/data/resume";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: DATA.name,
    url: DATA.url,
    image: `/api/og?title=${encodeURIComponent(DATA.name)}&description=${encodeURIComponent(DATA.description)}`,
    sameAs: [
      DATA.contact.social.GitHub.url,
      DATA.contact.social.LinkedIn.url,
      DATA.contact.social.X.url,
    ],
    jobTitle: "Software Engineer",
    description: DATA.description,
    alumniOf: DATA.education.map(edu => ({
      "@type": "EducationalOrganization",
      name: edu.school,
      url: edu.href,
    })),
    worksFor: DATA.work.map(work => ({
      "@type": "Organization",
      name: work.company,
      url: work.href,
    })),
    knowsAbout: DATA.skills,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "Kenya",
    },
    email: DATA.contact.email,
    telephone: DATA.contact.tel,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 