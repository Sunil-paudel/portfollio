import type { PortfolioData } from '@/ai/flows/portfolio-chatbot';

export const defaultPortfolioData: PortfolioData = {
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
    }
  ],
  contactInfo: {
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567",
    // Add other contact details like LinkedIn, GitHub if desired
    // socialLinks: [
    //   { platform: "LinkedIn", url: "https://linkedin.com/in/yourprofile" },
    //   { platform: "GitHub", url: "https://github.com/yourusername" }
    // ]
  },
  name: "Your Name", // Added name field
  title: "Full-Stack Developer | UI/UX Enthusiast", // Added title field
  profileImage: "https://placehold.co/300x300.png?text=Profile", // Added profile image
  profileImageHint: "person portrait"
};
