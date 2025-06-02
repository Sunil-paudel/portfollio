import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-8 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="#" passHref>
            <Github className="h-6 w-6 hover:text-accent transition-colors" />
          </Link>
          <Link href="#" passHref>
            <Linkedin className="h-6 w-6 hover:text-accent transition-colors" />
          </Link>
          <Link href="#" passHref>
            <Twitter className="h-6 w-6 hover:text-accent transition-colors" />
          </Link>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} PortfolioPilot. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Built with Next.js and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
