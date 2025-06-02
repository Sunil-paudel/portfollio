
import { z } from 'zod';

export const PortfolioDataSchema = z.object({
  name: z.string().optional().describe('The name of the portfolio owner.'),
  title: z.string().optional().describe('The professional title of the portfolio owner.'),
  profileImage: z.string().url().optional().describe('URL to the profile image of the portfolio owner.'),
  profileImageHint: z.string().optional().describe('Hint for AI image generation for profile picture.'),
  aboutMe: z.string().describe('A detailed description about the portfolio owner.'),
  skills: z.array(z.string()).describe('A list of skills the portfolio owner possesses.'),
  projects: z.array(z.object({
    name: z.string().describe('The name of the project.'),
    description: z.string().describe('A detailed description of the project.'),
    link: z.string().url().optional().describe('A link to the project.'),
    image: z.string().url().optional().describe('URL to an image representing the project.'),
    imageHint: z.string().optional().describe('Hint for AI image generation for project image.'),
  })).describe('A list of projects in the portfolio.'),
  contactInfo: z.object({
    email: z.string().email().describe('The email address to contact the portfolio owner.'),
    phone: z.string().optional().describe('The phone number to contact the portfolio owner.'),
  }).describe('Contact information for the portfolio owner.'),
});

export type PortfolioData = z.infer<typeof PortfolioDataSchema>;
