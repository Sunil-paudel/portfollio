
import type { PortfolioData } from '@/lib/portfolio-types';

// Function to sanitize project names for use as filenames
const sanitizeProjectName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/\//g, '-') // Replace slashes with hyphens
    .replace(/[()|:&]/g, '') // Remove parentheses, pipes, colons, ampersands
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
};

const projects: PortfolioData['projects'] = [
  {
    name: "Full Stack Developer/DevOps at AUSBIZ CONSULTING",
    description: "Created a Nextjs frontend application which communicate with Adonisjs backend using REST API. Used terminal to setup projects. Created relational database in AWS RDMS and configure security rules. Migrated database, seeded some data to let user choose from specific field keywords. Used GitHub to work in collaboration with huge team. Used oath authentication. Created a component to export resume in Google doc based on user input like experiences, projects, contributions and outcomes, skills etc. Tested the component and successfully exported resume using google API for accessing Drive, creating document and updating the document. Worked on photo uploading feature to AWS s3 and render it in profile giving user convenience to change their profile picture and successfully completed it.",
    link: undefined,
    image: "https://placehold.co/600x400.png",
    imageHint: "consulting devops"
  },
  {
    name: "Team member at Woolworths Group",
    description: "Provided exceptional customer service, addressing inquiries and resolving complaints to ensure a positive shopping experience. Met and exceeded sales targets through effective sales techniques, upselling, and cross-selling. Maintained in-depth product knowledge to assist customers and stay updated on new arrivals and promotions. Managed inventory by stocking shelves, conducting inventory checks, and processing shipments. Collaborated with team members to support store operations and create a positive work environment. Implemented visual merchandising strategies to create attractive product displays and maintain store appearance. Demonstrated strong problem-solving skills, effectively resolving customer and operational issues. Prioritized tasks and managed time efficiently to handle multiple customers and tasks simultaneously. Adapted to changing store policies, procedures, and product offerings to maintain high performance.",
    link: undefined,
    image: "https://placehold.co/600x400.png",
    imageHint: "retail work"
  },
  {
    name: "Portfolio Generator (Client: Ausbizz Consultant)",
    description: "Working as a full stack developer in an agile environment to develop a portfolio generator app. Working along with other Developers, BAs and Scrum master to understand the business requirement and delivery the project at the end of sprint. The project is deployed on an AWS cloud (https://portfolio.lvtpeople.com.au)--> this project was completed during bootcamp with Aus Bizz client. Technologies in this application are React.js, Next.js 13, Adonis.js, Material UI, GitHub",
    link: "https://portfolio.lvtpeople.com.au",
    image: "https://placehold.co/600x400.png",
    imageHint: "portfolio app aws"
  },
  {
    name: "Victoria University Scholarship Project",
    description: "Created a simple web application by choosing themes, having menus, and using navigation.",
    link: "https://home4664741.wordpress.com",
    image: "https://placehold.co/600x400.png",
    imageHint: "university wordpress"
  },
  {
    name: "Shopping Cart Manager (VU Project)",
    description: "Worked as a group of 2 to add, delete, sort and modify shopping cart using PHP, SQL.",
    link: undefined,
    image: "https://placehold.co/600x400.png",
    imageHint: "php sql project"
  },
  {
    name: "Tic Tac Toe (VU Project)",
    description: "Develop a fully functional GUI application to play game tic tac toe using java for Object oriented programming.",
    link: undefined,
    image: "https://placehold.co/600x400.png",
    imageHint: "java game gui"
  },
  {
    name: "Book Store in Salesforce (VU Project)",
    description: "Individually developed a salesforce Book store to mange merchandise. Created and managed custom objects and fields in Force.com. Developed a Book Store app with merchandise records. Added Price and Quantity fields to Merchandise object. Built an Invoice object with auto-numbering and status tracking.",
    link: undefined,
    image: "https://placehold.co/600x400.png",
    imageHint: "salesforce crm"
  },
  {
    name: "Nexen technology Web App (VU Project)",
    description: "Used .net core MVC framework to create a crud app using Visual Studio. Used scaffolding, Identity, data migration, data seeding, traditional and modern routing, Slug, Identity, API connection.",
    link: undefined,
    image: "https://placehold.co/600x400.png",
    imageHint: "dotnet mvc crud"
  },
  {
    name: "Personal Assistant Chatbot (PAC) web App (VU Project)",
    description: "Develop as a team of 3 using Nextjs, react, JavaScript, Next AUTH, MongoDB, nodemailer. GUI application that allows user to create account, schedule appointment, display, notify and send reminder to user and check the weather and Used prompt engineering to let user choose any question or directly ask question related to PAC or to let user know about their appointment and weather of current location or imputed location and save all the data to the database. A lot of brainstorming to discuss about the user story, the flow of application and how to ensure the UI compatible with many different devices.",
    link: "https://superrchatbot.vercel.app",
    image: "https://placehold.co/600x400.png",
    imageHint: "chatbot nextjs mongo"
  },
  {
    name: "WiX Strathfield Health Hub (VU Project)",
    description: "worked as a group of 2 people to create a website using Wix studio",
    link: "https://nakulthapa.wixsite.com/strathfieldhealthhub/",
    image: "https://placehold.co/600x400.png",
    imageHint: "wix website health"
  },
  {
    name: "University Mobile App (VU Project)",
    description: "Worked as an individual to develop simple android Application using android studio for frontend and spring boot for backend. Application allow user to create account, view detail information about courses. Used Json to seed and store data. Used features like authentication and recycle View to filter.",
    link: undefined,
    image: "https://placehold.co/600x400.png",
    imageHint: "android springboot mobile"
  }
];

export const defaultPortfolioData: PortfolioData = {
  name: "Sunil Paudel (Sunny)",
  title: "Full-Stack Developer Graduate",
  profileImage: "/resume photo.jpg",
  profileImageHint: "professional headshot",
  aboutMe: "A graduate from VU majoring in enterprise application development, and sub-major in ICT. Being equipped with different skill sets in collaborative application development and have experience in exposure to real-world industry challenges. Proficient in coding and problem-solving, particularly when the solutions can be applied to real-world scenarios. Eager to embark on a career as a full-stack developer and dedicating to generating positive outcomes for organisations while maintaining a commitment on continuous self-improvement with a strong passion about learning new technology, creating efficiency, scalable and maintainable software application.",
  skills: [
    "Typescript", "JavaScript", "Java", "Python", "C#", "PHP", "Kotlin", "HTML", "CSS",
    "Object-oriented programming", "User story", "Unit Testing", "Cyber security",
    "Data structures and algorithms", "Git", "CI/CD", "React.js", "Adonis.js",
    "Next.js", "Express.js", "Critical thinking", "Problem-solving", "Communication",
    "Teamwork", "Adaptability", "Openness to criticism", "Stress management", "Linux",
    "AWS", "Vercel", "Salesforce", "PostgreSQL", "MongoDB", "Node.js", "Prisma",
    "GitHub", "Copilot", "ChatGPT", "Technical documentation", "Troubleshooting and Diagnosis"
  ],
  projects: projects,
  contactInfo: {
    email: "paudelsunil16@gmail.com",
    phone: "0413177566",
  },
};
