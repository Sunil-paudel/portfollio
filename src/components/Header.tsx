
"use client";

import { Briefcase, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 bg-background/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-primary hover:text-accent transition-colors" onClick={closeMobileMenu}>
          <Briefcase className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="font-headline">Sunil's Portfolio</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
          <a href="#projects" className="text-foreground hover:text-primary transition-colors">Projects</a>
          <a href="#skills" className="text-foreground hover:text-primary transition-colors">Skills</a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            className="text-foreground hover:text-primary"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background shadow-lg py-4 z-50 border-t border-border">
          <nav className="flex flex-col items-center space-y-4">
            <a href="#about" className="text-foreground hover:text-primary transition-colors" onClick={closeMobileMenu}>About</a>
            <a href="#projects" className="text-foreground hover:text-primary transition-colors" onClick={closeMobileMenu}>Projects</a>
            <a href="#skills" className="text-foreground hover:text-primary transition-colors" onClick={closeMobileMenu}>Skills</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors" onClick={closeMobileMenu}>Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
}
