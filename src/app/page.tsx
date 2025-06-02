
"use client";

import React, { useState, useEffect } from 'react';
import type { PortfolioData } from '@/ai/flows/portfolio-chatbot';
import { defaultPortfolioData } from '@/lib/default-portfolio-data';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { AboutMeSection } from '@/components/AboutMeSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import type { ProjectFormValues } from '@/components/modals/EditProjectModal';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { EditProfileModal } from '@/components/modals/EditProfileModal';
import { EditProjectModal } from '@/components/modals/EditProjectModal';
import { useToast } from '@/hooks/use-toast';

type ProjectType = PortfolioData['projects'][number] & { image?: string; imageHint?: string };

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);
  const [isClient, setIsClient] = useState(false);

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [currentEditingProject, setCurrentEditingProject] = useState<ProjectType | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const currentDefaults = defaultPortfolioData;
    const savedData = localStorage.getItem('portfolioData');

    if (savedData) {
      try {
        const parsedLSData = JSON.parse(savedData) as PortfolioData;
        
        const dataToSet: PortfolioData = {
          ...currentDefaults, // Base with new defaults

          name: (parsedLSData.name && parsedLSData.name !== "Your Name" && parsedLSData.name !== "Sunil") 
                ? parsedLSData.name 
                : currentDefaults.name,

          title: (parsedLSData.title && parsedLSData.title !== "Full-Stack Developer | UI/UX Enthusiast") 
                 ? parsedLSData.title 
                 : currentDefaults.title,

          aboutMe: parsedLSData.aboutMe ?? currentDefaults.aboutMe,
          skills: parsedLSData.skills ?? currentDefaults.skills,
          projects: parsedLSData.projects ?? currentDefaults.projects,
          
          contactInfo: {
            ...currentDefaults.contactInfo, 
            email: (parsedLSData.contactInfo?.email && parsedLSData.contactInfo.email !== "your.email@example.com") 
                   ? parsedLSData.contactInfo.email 
                   : currentDefaults.contactInfo.email,
            phone: parsedLSData.contactInfo?.phone ?? currentDefaults.contactInfo.phone,
          },

          profileImage: parsedLSData.profileImage ?? currentDefaults.profileImage,
          profileImageHint: parsedLSData.profileImageHint ?? currentDefaults.profileImageHint,
        };

        // Special handling for profile image placeholder update (keep this logic)
        if (parsedLSData.profileImage && parsedLSData.profileImage.includes('placehold.co') && currentDefaults.profileImage) {
          dataToSet.profileImage = currentDefaults.profileImage;
          dataToSet.profileImageHint = currentDefaults.profileImageHint;
        }
        
        setPortfolioData(dataToSet);
      } catch (error) {
        console.error("Failed to parse portfolio data from localStorage", error);
        setPortfolioData(currentDefaults); // Fallback to new defaults if LS is corrupt
      }
    } else {
      setPortfolioData(currentDefaults); // No LS data, use new defaults
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    }
  }, [portfolioData, isClient]);

  const handleSaveProfile = (updatedProfileData: PortfolioData) => {
    setPortfolioData(prevData => ({
        ...prevData,
        name: updatedProfileData.name,
        title: updatedProfileData.title,
        aboutMe: updatedProfileData.aboutMe,
        skills: updatedProfileData.skills,
        contactInfo: updatedProfileData.contactInfo,
        profileImage: updatedProfileData.profileImage,
        profileImageHint: updatedProfileData.profileImageHint,
    }));
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  const handleOpenAddProjectModal = () => {
    setCurrentEditingProject(null);
    setIsEditProjectModalOpen(true);
  };

  const handleOpenEditProjectModal = (project: ProjectType) => {
    setCurrentEditingProject(project);
    setIsEditProjectModalOpen(true);
  };

  const handleSaveProject = (projectValues: ProjectFormValues, originalName?: string) => {
    setPortfolioData(prevData => {
      const newProject: ProjectType = {
        name: projectValues.name,
        description: projectValues.description,
        link: projectValues.link,
        image: projectValues.image || 'https://placehold.co/600x400.png?text=Project',
        imageHint: projectValues.imageHint || 'project related'
      };

      let updatedProjects;
      if (originalName) { // Editing existing project
        updatedProjects = prevData.projects.map(p => p.name === originalName ? newProject : p);
         toast({ title: "Project Updated", description: `"${newProject.name}" has been updated.` });
      } else { // Adding new project
        updatedProjects = [...prevData.projects, newProject];
        toast({ title: "Project Added", description: `"${newProject.name}" has been added to your portfolio.` });
      }
      return { ...prevData, projects: updatedProjects };
    });
  };

  const handleDeleteProject = (projectName: string) => {
    if (window.confirm(`Are you sure you want to delete the project "${projectName}"?`)) {
      setPortfolioData(prevData => ({
        ...prevData,
        projects: prevData.projects.filter(p => p.name !== projectName)
      }));
      toast({ title: "Project Deleted", description: `"${projectName}" has been removed.`, variant: "destructive" });
    }
  };
  
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
        <AboutMeSection aboutMe={portfolioData.aboutMe} onEdit={() => setIsEditProfileModalOpen(true)} />
        <SkillsSection skills={portfolioData.skills} />
        <ProjectsSection 
            projects={portfolioData.projects as ProjectType[]} 
            onAddProject={handleOpenAddProjectModal}
            onEditProject={handleOpenEditProjectModal}
            onDeleteProject={handleDeleteProject}
        />
        <ContactForm />
      </main>
      <Footer />
      <ChatbotWidget portfolioData={portfolioData} />

      {isEditProfileModalOpen && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          profileData={portfolioData}
          onSave={handleSaveProfile}
        />
      )}

      {isEditProjectModalOpen && (
         <EditProjectModal
            isOpen={isEditProjectModalOpen}
            onClose={() => setIsEditProjectModalOpen(false)}
            project={currentEditingProject}
            onSave={handleSaveProject}
        />
      )}
    </div>
  );
}

