
'use server';
/**
 * @fileOverview An AI flow to extract portfolio data from resume text.
 *
 * - extractResumeData - A function that handles resume data extraction.
 * - ExtractResumeDataInput - The input type for the extractResumeData function.
 * - ExtractedPortfolioData - The return type for the extractResumeData function (a partial PortfolioData).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema for the data we expect to extract from the resume
// It's a partial representation of PortfolioData, as not all fields will be in a resume.
const ExtractedProjectSchema = z.object({
  name: z.string().optional().describe('The name of the project or significant experience mentioned in the resume.'),
  description: z.string().optional().describe('A detailed description of the project or experience extracted from the resume.'),
  link: z.string().url().optional().describe('A URL link related to the project, if mentioned.'),
  // image and imageHint are omitted as they are not typically found in resume text
});
export type ExtractedProjectType = z.infer<typeof ExtractedProjectSchema>;

const ExtractedPortfolioDataSchema = z.object({
  name: z.string().optional().describe('The full name of the person, extracted from the resume.'),
  title: z.string().optional().describe('The professional title or headline (e.g., Software Engineer, Web Developer), extracted from the resume.'),
  aboutMe: z.string().optional().describe('A summary, objective, or personal statement from the resume, suitable for an "About Me" section.'),
  skills: z.array(z.string()).optional().describe('A list of technical, professional, or soft skills extracted from the resume. Each skill should be a separate string in the array.'),
  projects: z.array(ExtractedProjectSchema).optional().describe('A list of projects or significant work experiences detailed in the resume. Each project should include a name and description if available.'),
  contactInfo: z.object({
    email: z.string().email().optional().describe('The email address extracted from the resume.'),
    phone: z.string().optional().describe('The phone number extracted from the resume.'),
  }).optional().describe('Contact information extracted from the resume.'),
  // profileImage and profileImageHint are omitted
});
export type ExtractedPortfolioData = z.infer<typeof ExtractedPortfolioDataSchema>;


const ExtractResumeDataInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the resume.'),
});
export type ExtractResumeDataInput = z.infer<typeof ExtractResumeDataInputSchema>;

export async function extractResumeData(input: ExtractResumeDataInput): Promise<ExtractedPortfolioData> {
  return extractResumeDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractResumeDataPrompt',
  input: {schema: ExtractResumeDataInputSchema},
  output: {schema: ExtractedPortfolioDataSchema},
  prompt: `You are an expert resume parser. Your task is to extract structured information from the provided resume text to populate a personal portfolio website.
  The resume text is:
  {{{resumeText}}}

  Please extract the following information and structure it according to the output schema:
  - Name: The full name of the individual.
  - Title: Their professional title or a suitable headline (e.g., "Software Engineer", "Aspiring IT Professional").
  - About Me: A concise summary, objective, or personal statement that can be used for an "About Me" section.
  - Skills: A list of skills. These can be technical skills, software proficiency, programming languages, or soft skills.
  - Projects: Details of projects or significant work experiences. For each project, try to identify a name, a description, and a URL if available. If specific project names are not clear, use the company name or a role title as the project name.
  - Contact Info: Email address and phone number.

  Focus on accuracy and completeness based *only* on the provided text. If a piece of information is not present, omit the field or leave it as undefined. Do not invent information.
  For skills, provide them as an array of strings.
  For projects, provide them as an array of objects, each with 'name', 'description', and optionally 'link'.
  `,
});

const extractResumeDataFlow = ai.defineFlow(
  {
    name: 'extractResumeDataFlow',
    inputSchema: ExtractResumeDataInputSchema,
    outputSchema: ExtractedPortfolioDataSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    // Ensure output is not null, even if AI returns nothing, conform to schema (empty object or object with undefined fields)
    return output || {};
  }
);
