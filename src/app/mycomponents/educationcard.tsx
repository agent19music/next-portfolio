"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
}

export const EducationCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [description]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Link
      href={href || "#"}
      className="block cursor-pointer"
      onClick={handleClick}
    >
      <Card 
        className="flex flex-col sm:flex-row"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          color: 'var(--card-text)'
        }}
      >
        <div className="flex justify-start pl-4 py-3 sm:p-4 sm:w-16 md:w-20">
          <Avatar className="border size-10 sm:size-12 bg-muted-background dark:bg-foreground">
            <AvatarImage src={logoUrl} alt={altText} className="object-contain" />
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow flex-col group">
          <CardHeader className="px-4 py-2 sm:py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-x-2">
              <h3 className="inline-flex items-center font-semibold leading-none text-xs sm:text-sm" style={{ color: 'var(--card-text)' }}>
                {title}
                <ExternalLink
                  className={cn(
                    "ml-1 size-4 transform",
                    isExpanded ? "rotate-90" : "rotate-0",
                    "sm:opacity-0 sm:group-hover:opacity-100 sm:transition-all sm:duration-300 sm:ease-out sm:group-hover:translate-x-1 sm:translate-x-0"
                  )}
                  style={{ color: 'var(--card-text)' }}
                />
              </h3>
              <div className="text-xs sm:text-sm tabular-nums text-muted-foreground sm:text-right" style={{ color: 'var(--muted)' }}>
                {period}
              </div>
            </div>
            {subtitle && <div className="text-xs mt-1" style={{ color: 'var(--card-text)' }}>{subtitle}</div>}
            {badges && badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {badges.map((badge, index) => (
                  <Badge
                    variant="secondary"
                    className="align-middle text-xs"
                    key={index}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          {description && (
            <>
              <div 
                ref={contentRef} 
                className="absolute opacity-0 pointer-events-none px-4 pb-4 text-xs sm:text-sm"
                style={{ color: 'var(--card-text)' }}
              >
                {description}
              </div>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  height: isExpanded ? contentHeight : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="px-4 pb-4 text-xs sm:text-sm overflow-hidden"
                style={{ color: 'var(--card-text)' }}
              >
                {description}
              </motion.div>
            </>
          )}
        </div>
      </Card>
    </Link>
  );
};