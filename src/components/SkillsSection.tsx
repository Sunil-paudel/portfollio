
"use client";

import React, { useState } from 'react';
import type { PortfolioData } from '@/lib/portfolio-types'; // Updated import
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code2, Database, Cloud, Paintbrush, Smartphone, Server, Settings, Zap, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface SkillsSectionProps {
  skills: PortfolioData['skills'];
}

const INITIAL_SKILLS_LIMIT = 12;

const getSkillIcon = (skill: string) => {
  const lowerSkill = skill.toLowerCase();
  if (lowerSkill.includes('react') || lowerSkill.includes('next.js') || lowerSkill.includes('vue') || lowerSkill.includes('angular') || lowerSkill.includes('frontend')) return <Code2 className="mr-2 h-4 w-4" />;
  if (lowerSkill.includes('node.js') || lowerSkill.includes('python') || lowerSkill.includes('java') || lowerSkill.includes('backend')) return <Server className="mr-2 h-4 w-4" />;
  if (lowerSkill.includes('sql') || lowerSkill.includes('mongo') || lowerSkill.includes('database')) return <Database className="mr-2 h-4 w-4" />;
  if (lowerSkill.includes('aws') || lowerSkill.includes('azure') || lowerSkill.includes('gcp') || lowerSkill.includes('cloud')) return <Cloud className="mr-2 h-4 w-4" />;
  if (lowerSkill.includes('design') || lowerSkill.includes('figma') || lowerSkill.includes('sketch') || lowerSkill.includes('ui/ux')) return <Paintbrush className="mr-2 h-4 w-4" />;
  if (lowerSkill.includes('swift') || lowerSkill.includes('kotlin') || lowerSkill.includes('mobile')) return <Smartphone className="mr-2 h-4 w-4" />;
  if (lowerSkill.includes('tailwind') || lowerSkill.includes('css') || lowerSkill.includes('html')) return <Settings className="mr-2 h-4 w-4" />;
  if (lowerSkill.includes('api') || lowerSkill.includes('rest')) return <Zap className="mr-2 h-4 w-4" />;
  return <Lightbulb className="mr-2 h-4 w-4" />;
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [showAllSkills, setShowAllSkills] = useState(false);

  const skillsToShow = showAllSkills ? skills : skills.slice(0, INITIAL_SKILLS_LIMIT);

  const toggleShowAllSkills = () => {
    setShowAllSkills(!showAllSkills);
  };

  return (
    <section id="skills" className="py-16 sm:py-24 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <Zap className="w-10 h-10" /> Skills
          </h2>
        </div>
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4">
          {skillsToShow.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-lg px-6 py-3 rounded-lg shadow-md bg-card text-card-foreground border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default flex items-center"
            >
              {getSkillIcon(skill)}
              {skill}
            </Badge>
          ))}
        </div>
        {skills.length > INITIAL_SKILLS_LIMIT && (
          <div className="text-center mt-8">
            <Button
              onClick={toggleShowAllSkills}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {showAllSkills ? (
                <>
                  See Less <ChevronUp className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  See More <ChevronDown className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
