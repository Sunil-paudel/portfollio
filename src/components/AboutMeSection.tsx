
"use client";

import type { PortfolioData } from '@/ai/flows/portfolio-chatbot';
import { Button } from '@/components/ui/button';
import { UserCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface AboutMeSectionProps {
  aboutMe: PortfolioData['aboutMe'];
  // onEdit prop removed
}

const MAX_ABOUT_LENGTH = 300; // Max characters to show before truncating

// onEdit parameter removed
export function AboutMeSection({ aboutMe }: AboutMeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const needsTruncation = aboutMe.length > MAX_ABOUT_LENGTH;
  const displayedAboutMe = isExpanded || !needsTruncation
    ? aboutMe
    : `${aboutMe.substring(0, MAX_ABOUT_LENGTH)}...`;

  return (
    <section id="about" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <UserCircle className="w-8 h-8 sm:w-10 sm:h-10" /> About Me
          </h2>
        </div>
        <div className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-xl shadow-xl">
          <p className="text-lg text-card-foreground leading-relaxed whitespace-pre-line">
            {displayedAboutMe}
          </p>
          {needsTruncation && (
            <Button
              variant="link"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-accent hover:text-primary p-0 mt-2 h-auto inline-flex items-center text-sm"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
              {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
            </Button>
          )}
          {/* Edit Profile button and its surrounding div removed */}
        </div>
      </div>
    </section>
  );
}
