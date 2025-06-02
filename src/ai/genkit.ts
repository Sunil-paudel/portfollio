import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// use the api key from the .env file
export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GOOGLE_API_KEY})],
  model: 'googleai/gemini-2.0-flash',
});