
'use server';

/**
 * @fileOverview An AI chatbot for answering questions about the portfolio.
 *
 * - portfolioChatbot - A function that handles the chatbot interaction.
 * - PortfolioChatbotInput - The input type for the portfolioChatbot function.
 * - PortfolioChatbotOutput - The return type for the portfolioChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PortfolioDataSchema = z.object({
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

const PortfolioChatbotInputSchema = z.object({
  query: z.string().describe('The user query about the portfolio.'),
  portfolioData: PortfolioDataSchema.describe('The portfolio data to answer questions from.')
});

export type PortfolioChatbotInput = z.infer<typeof PortfolioChatbotInputSchema>;

const PortfolioChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
});

export type PortfolioChatbotOutput = z.infer<typeof PortfolioChatbotOutputSchema>;

export async function portfolioChatbot(input: PortfolioChatbotInput): Promise<PortfolioChatbotOutput> {
  return portfolioChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'portfolioChatbotPrompt',
  input: {
    schema: PortfolioChatbotInputSchema,
  },
  output: {
    schema: PortfolioChatbotOutputSchema,
  },
  prompt: `You are a chatbot assistant specializing in answering questions about {{portfolioData.name}}'s portfolio.
  Use the provided portfolio data to answer the user's question.
  If the question cannot be answered using the portfolio data, respond politely that you are unable to answer the question.

  Portfolio Data:
  Name: {{{portfolioData.name}}}
  Title: {{{portfolioData.title}}}
  About Me: {{{portfolioData.aboutMe}}}
  Skills: {{#each portfolioData.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Projects: {{#each portfolioData.projects}}
    Name: {{{name}}}
    Description: {{{description}}}
    {{#if link}}Link: {{{link}}}{{/if}}
  {{/each}}
  Contact Info:
    Email: {{{portfolioData.contactInfo.email}}}
    {{#if portfolioData.contactInfo.phone}}Phone: {{{portfolioData.contactInfo.phone}}}{{/if}}

  User Query: {{{query}}}
  `,
});

const portfolioChatbotFlow = ai.defineFlow(
  {
    name: 'portfolioChatbotFlow',
    inputSchema: PortfolioChatbotInputSchema,
    outputSchema: PortfolioChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

