
import type { PortfolioData } from '@/lib/portfolio-types';
import { ProjectCard } from './ProjectCard';
// Button and PlusCircle are no longer needed
import { Layers } from 'lucide-react';

type Project = PortfolioData['projects'][number] & { image?: string; imageHint?: string };

interface ProjectsSectionProps {
  projects: Project[];
  // onAddProject prop removed
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <Layers className="w-10 h-10" /> My Projects
          </h2>
          {/* "Add Project" Button removed */}
        </div>
        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg">No projects available at this time.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard 
                key={project.name} 
                project={project} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
