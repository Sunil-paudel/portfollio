
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { PortfolioData } from '@/lib/portfolio-types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

type Project = PortfolioData['projects'][number] & { image?: string; imageHint?: string };

interface ProjectCardProps {
  project: Project;
}

const MAX_DESCRIPTION_LENGTH = 150; // Adjust as needed

export function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const descriptionNeedsTruncation = project.description.length > MAX_DESCRIPTION_LENGTH;
  const displayedDescription = isExpanded || !descriptionNeedsTruncation
    ? project.description
    : `${project.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden bg-card">
      {project.image && (
        <div className="relative w-full h-56">
          <Image
            src={project.image}
            alt={`Screenshot or visual representation of the ${project.name} project`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={project.imageHint || "project technology"}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {displayedDescription}
        </CardDescription>
        {descriptionNeedsTruncation && (
          <Button
            variant="link"
            onClick={toggleDescription}
            className="text-accent hover:text-primary p-0 mt-2 h-auto"
          >
            {isExpanded ? (
              <>
                Read Less <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Read More <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
        <div className="flex gap-2">
          {project.link && (
            <Button variant="outline" size="sm" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link href={project.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
