'use server';
/**
 * @fileOverview An AI flow to answer questions about Sunil's portfolio.
 *
 * - queryPortfolio - A function that handles queries about the portfolio.
 * - PortfolioQueryInput - The input type for the queryPortfolio function.
 * - PortfolioQueryOutput - The return type for the queryPortfolio function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PortfolioDataSchema, type PortfolioData } from '@/lib/portfolio-types';

// Input schema for the flow
const PortfolioQueryInputSchema = z.object({
  portfolioData: PortfolioDataSchema.describe('The complete portfolio data for Sunil Paudel.'),
  userQuery: z.string().describe('The user\'s question about the portfolio.'),
});
export type PortfolioQueryInput = z.infer<typeof PortfolioQueryInputSchema>;

// Output schema for the flow
const PortfolioQueryOutputSchema = z.object({
  chatbotResponse: z.string().describe('The chatbot\'s answer to the user\'s query.'),
});
export type PortfolioQueryOutput = z.infer<typeof PortfolioQueryOutputSchema>;

// Exported function to be called from the frontend
export async function queryPortfolio(input: PortfolioQueryInput): Promise<PortfolioQueryOutput> {
  return portfolioQueryFlow(input);
}

// Define the prompt
const portfolioQueryPrompt = ai.definePrompt({
  name: 'portfolioQueryPrompt',
  input: { schema: PortfolioQueryInputSchema },
  output: { schema: PortfolioQueryOutputSchema },
  prompt: `You are a helpful AI assistant for Sunil Paudel's portfolio.
Your goal is to answer questions based *only* on the provided portfolio data.
Do not make up information. If the answer is not in the data, say that you don't have that information or ask the user to use the contact form.
Be concise and friendly.

Portfolio Data:
Name: {{{portfolioData.name}}}
Title: {{{portfolioData.title}}}
About Me: {{{portfolioData.aboutMe}}}

Skills:
{{#each portfolioData.skills}}
- {{{this}}}
{{/each}}

Projects:
{{#each portfolioData.projects}}
- Project Name: {{{this.name}}}
  Description: {{{this.description}}}
  {{#if this.link}}Link: {{{this.link}}}{{/if}}
{{/each}}

Contact Info:
Email: {{{portfolioData.contactInfo.email}}}
{{#if portfolioData.contactInfo.phone}}Phone: {{{portfolioData.contactInfo.phone}}}{{/if}}

User's Question: {{{userQuery}}}

Provide your answer to the user's question.
`,
});

// Define the flow
const portfolioQueryFlow = ai.defineFlow(
  {
    name: 'portfolioQueryFlow',
    inputSchema: PortfolioQueryInputSchema,
    outputSchema: PortfolioQueryOutputSchema,
  },
  async (input) => {
    // It's good practice to ensure the model has some data to work with.
    if (!input.portfolioData || !input.userQuery) {
        return { chatbotResponse: "I need more information to answer that. Please ensure the portfolio data and your query are provided." };
    }
    const { output } = await portfolioQueryPrompt(input);
    if (!output) {
      return { chatbotResponse: "I'm sorry, I couldn't generate a response at this time. Please try again." };
    }
    return output;
  }
);
