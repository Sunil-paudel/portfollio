
import type { PortfolioData } from '@/ai/flows/portfolio-chatbot';

export const defaultPortfolioData: PortfolioData = {
  name: "SUNIL PAUDEL", // Updated name
  title: "Savvy IT Aspirant", // Updated title
  profileImage: "/sunil_photo.png", 
  profileImageHint: "Sunil photo",
  aboutMe: "I am a passionate and creative full-stack developer with a knack for building beautiful and functional web applications. I enjoy turning complex problems into simple, elegant solutions. When I'm not coding, you can find me exploring new technologies or contributing to open-source projects.",
  skills: [
    "JavaScript (ES6+)",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "Firebase",
    "Git & GitHub",
    "REST APIs",
    "UI/UX Design Principles"
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "A full-featured e-commerce platform with product listings, user authentication, shopping cart, and a checkout process. Built with Next.js, Stripe, and Firebase.",
      link: "https://example.com/ecommerce",
      image: "https://placehold.co/600x400.png?text=E-commerce+Platform",
      imageHint: "online store"
    },
    {
      name: "Task Management App",
      description: "A collaborative task management application that allows users to create, assign, and track tasks within teams. Features real-time updates and a drag-and-drop interface.",
      image: "https://placehold.co/600x400.png?text=Task+Manager",
      imageHint: "productivity app"
    },
    {
      name: "Personal Blog",
      description: "A statically generated blog built with Next.js and Markdown. Features a clean design, fast performance, and easy content management.",
      link: "https://example.com/blog",
      image: "https://placehold.co/600x400.png?text=Personal+Blog",
      imageHint: "writing online"
    },
    {
      name: "LinkedIn Project 1 (Edit Me)",
      description: "Please replace this with the description of your first project from LinkedIn. Include key responsibilities, technologies used, and achievements.",
      link: "https://your-project-link-here.com", // Optional: Add link if available
      image: "https://placehold.co/600x400.png?text=LinkedIn+Project+1",
      imageHint: "professional project" // Optional: Add 1-2 keywords for image search
    },
    {
      name: "LinkedIn Project 2 (Edit Me)",
      description: "Please replace this with the description of your second project from LinkedIn. Detail your role and impact.",
      link: "", // Optional: Add link if available
      image: "https://placehold.co/600x400.png?text=LinkedIn+Project+2",
      imageHint: "work experience" // Optional: Add 1-2 keywords for image search
    }
  ],
  contactInfo: {
    email: "paudelsunil16@gmail.com", // Updated email
    phone: "+1 (555) 123-4567",
  },
};

