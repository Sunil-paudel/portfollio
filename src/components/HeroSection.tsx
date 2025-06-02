
import Image from 'next/image';
import type { PortfolioData } from '@/lib/portfolio-types'; // Updated import
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  name: PortfolioData['name'];
  title: PortfolioData['title'];
  profileImage: PortfolioData['profileImage'];
  profileImageHint?: string;
}

export function HeroSection({ name, title, profileImage, profileImageHint }: HeroSectionProps) {
  return (
    <section className="min-h-[calc(100vh-88px)] flex items-center justify-center py-16 bg-gradient-to-br from-background to-muted text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {profileImage && (
          <div className="mb-8">
            <Image
              src={profileImage}
              alt={name || 'Profile'}
              width={180}
              height={180}
              className="rounded-full mx-auto shadow-xl border-4 border-primary object-cover"
              data-ai-hint={profileImageHint || "profile picture"}
              priority
            />
          </div>
        )}
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary mb-4">
          {name || "Your Name"}
        </h1>
        <p className="text-xl md:text-2xl text-foreground mb-8 max-w-3xl mx-auto">
          {title || "Your Professional Title"}
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-primary text-accent-foreground hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 shadow-lg">
          <a href="#contact">
            Get in Touch <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
          </a>
        </Button>
      </div>
    </section>
  );
}
