
"use client";

import React, { useState, useEffect } from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';
import { defaultPortfolioData } from '@/lib/default-portfolio-data';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { AboutMeSection } from '@/components/AboutMeSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
// ProjectFormValues and EditProjectModal are no longer needed as Add Project is removed
import ContactForm from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
// useToast is no longer needed for project actions
// import { useToast } from '@/hooks/use-toast';

type ProjectType = PortfolioData['projects'][number] & { image?: string; imageHint?: string };

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);
  const [isClient, setIsClient] = useState(false);

  // State for EditProjectModal (for adding) is removed
  // const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  
  // useToast is removed as project add/update/delete toasts are no longer used from this page
  // const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const currentDefaults = defaultPortfolioData;
    const savedData = localStorage.getItem('portfolioData');

    if (savedData) {
      try {
        const parsedLSData = JSON.parse(savedData) as PortfolioData;
        
        const dataToSet: PortfolioData = {
          name: (parsedLSData.name && parsedLSData.name !== "Your Name" && parsedLSData.name !== "Sunil" && parsedLSData.name !== "SUNIL PAUDEL" && parsedLSData.name !== "Sunil Paudel (Sunny)") 
                ? parsedLSData.name 
                : currentDefaults.name,

          title: (parsedLSData.title && parsedLSData.title !== "Full-Stack Developer | UI/UX Enthusiast" && parsedLSData.title !== "Savvy IT Aspirant" && parsedLSData.title !== "Full-Stack Developer Graduate") 
                 ? parsedLSData.title 
                 : currentDefaults.title,
          
          contactInfo: {
            ...currentDefaults.contactInfo, 
            email: (parsedLSData.contactInfo?.email && parsedLSData.contactInfo.email !== "your.email@example.com" && parsedLSData.contactInfo.email !== "paudelsunil16@gmail.com") 
                   ? parsedLSData.contactInfo.email 
                   : currentDefaults.contactInfo.email,
            phone: currentDefaults.contactInfo.phone, 
          },

          aboutMe: currentDefaults.aboutMe,
          skills: currentDefaults.skills,
          projects: currentDefaults.projects,
          
          profileImage: parsedLSData.profileImage || currentDefaults.profileImage,
          profileImageHint: parsedLSData.profileImageHint || currentDefaults.profileImageHint,
        };
        
        setPortfolioData(dataToSet);
      } catch (error) {
        console.error("Failed to parse portfolio data from localStorage", error);
        setPortfolioData(currentDefaults); 
      }
    } else {
      setPortfolioData(currentDefaults); 
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    }
  }, [portfolioData, isClient]);

  // handleOpenAddProjectModal is removed
  // const handleOpenAddProjectModal = () => {
  //   setIsEditProjectModalOpen(true);
  // };

  // handleSaveProject is removed as it was only for adding projects
  // const handleSaveProject = (projectValues: ProjectFormValues, originalName?: string) => {
  //   setPortfolioData(prevData => {
  //     const newProject: ProjectType = {
  //       name: projectValues.name,
  //       description: projectValues.description,
  //       link: projectValues.link,
  //       image: projectValues.image || 'https://placehold.co/600x400.png',
  //       imageHint: projectValues.imageHint || 'project related'
  //     };

  //     let updatedProjects;
  //     if (originalName) { 
  //       updatedProjects = prevData.projects.map(p => p.name === originalName ? newProject : p);
  //        toast({ title: "Project Updated", description: `${newProject.name} has been updated.` });
  //     } else { 
  //       updatedProjects = [...prevData.projects, newProject];
  //       toast({ title: "Project Added", description: `${newProject.name} has been added to your portfolio.` });
  //     }
  //     return { ...prevData, projects: updatedProjects };
  //   });
  // };
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-primary text-xl font-semibold">Loading Sunil's Portfolio...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection 
            name={portfolioData.name} 
            title={portfolioData.title}
            profileImage={portfolioData.profileImage}
            profileImageHint={portfolioData.profileImageHint}
        />
        <AboutMeSection aboutMe={portfolioData.aboutMe} />
        <SkillsSection skills={portfolioData.skills} />
        <ProjectsSection 
            projects={portfolioData.projects as ProjectType[]} 
            // onAddProject prop removed
        />
        <ContactForm />
      </main>
      <Footer />
      
      {/* EditProjectModal rendering is removed */}
      {/*
      {isEditProjectModalOpen && (
         <EditProjectModal
            isOpen={isEditProjectModalOpen}
            onClose={() => setIsEditProjectModalOpen(false)}
            project={null}
            onSave={handleSaveProject}
        />
      )}
      */}
    </div>
  );
}
