import Image from 'next/image';
import type { PortfolioData } from '@/lib/portfolio-types';
import { Button } from '@/components/ui/button';
import { ArrowDown, Download } from 'lucide-react';

interface HeroSectionProps {
  name: PortfolioData['name'];
  title: PortfolioData['title'];
  profileImage: PortfolioData['profileImage'];
  profileImageHint?: string;
}

export function HeroSection({ name, title, profileImage, profileImageHint }: HeroSectionProps) {
  const heroName = name || "Your Name";
  return (
    <section className="min-h-[calc(100vh-88px)] flex items-center justify-center py-16 bg-gradient-to-br from-background to-muted text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {profileImage && (
          <div className="mb-8">
            <Image
              src={profileImage}
              alt={`${heroName} - Profile Picture`}
              width={180}
              height={180}
              className="rounded-full mx-auto shadow-xl border-4 border-primary object-cover"
              data-ai-hint={profileImageHint || "profile picture"}
              priority
            />
          </div>
        )}
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary mb-4">
          {heroName}
        </h1>
        <p className="text-xl md:text-2xl text-foreground mb-8 max-w-3xl mx-auto">
          {title || "Your Professional Title"}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-accent hover:bg-primary text-accent-foreground hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 shadow-lg">
            <a href="#contact">
              Get in Touch <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 shadow-lg">
            <a href="/Sunil Full stack developer Resume (1).pdf" download="Sunil Full stack developer Resume (1).pdf">
              Download Resume <Download className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
