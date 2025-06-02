import type { PortfolioData } from '@/ai/flows/portfolio-chatbot';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

interface AboutMeSectionProps {
  aboutMe: PortfolioData['aboutMe'];
  onEdit: () => void;
}

export function AboutMeSection({ aboutMe, onEdit }: AboutMeSectionProps) {
  return (
    <section id="about" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <UserCircle className="w-10 h-10" /> About Me
          </h2>
        </div>
        <div className="max-w-3xl mx-auto bg-card p-8 rounded-xl shadow-xl">
          <p className="text-lg text-card-foreground leading-relaxed whitespace-pre-line">
            {aboutMe}
          </p>
          <div className="mt-8 text-right">
            <Button onClick={onEdit} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
