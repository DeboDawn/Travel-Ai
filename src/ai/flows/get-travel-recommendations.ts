'use server';
/**
 * @fileOverview An AI-powered travel assistant that can answer questions and provide recommendations.
 *
 * - getTravelRecommendations - A function that handles user questions about travel destinations.
 * - GetTravelRecommendationsInput - The input type for the getTravelRecommendations function.
 * - GetTravelRecommendationsOutput - The return type for the getTravelRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetTravelRecommendationsInputSchema = z.object({
  destination: z.string().describe('The travel destination the user is asking about.'),
  question: z.string().describe('The user\'s question about the destination, e.g., local customs, best restaurants, or hidden gems.'),
});
export type GetTravelRecommendationsInput = z.infer<typeof GetTravelRecommendationsInputSchema>;

const GetTravelRecommendationsOutputSchema = z.object({
  answer: z.string().describe('A helpful and detailed answer or recommendation based on the user\'s question and destination.'),
});
export type GetTravelRecommendationsOutput = z.infer<typeof GetTravelRecommendationsOutputSchema>;

export async function getTravelRecommendations(input: GetTravelRecommendationsInput): Promise<GetTravelRecommendationsOutput> {
  return getTravelRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getTravelRecommendationsPrompt',
  input: { schema: GetTravelRecommendationsInputSchema },
  output: { schema: GetTravelRecommendationsOutputSchema },
  prompt: `You are a helpful and knowledgeable travel assistant named WanderWise.
Your goal is to provide accurate, engaging, and detailed recommendations or answers to traveler questions about their destination.

Destination: {{{destination}}}
Question: {{{question}}}

Based on the destination and question provided, offer comprehensive and insightful recommendations, local tips, or answers to help the traveler plan their trip. Be friendly and enthusiastic. If you cannot find information about the destination, try to provide generic travel advice, or ask clarifying questions.
`,
});

const getTravelRecommendationsFlow = ai.defineFlow(
  {
    name: 'getTravelRecommendationsFlow',
    inputSchema: GetTravelRecommendationsInputSchema,
    outputSchema: GetTravelRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
