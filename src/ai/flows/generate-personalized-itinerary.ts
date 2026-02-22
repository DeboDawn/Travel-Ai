'use server';
/**
 * @fileOverview A Genkit flow that generates a personalized travel itinerary based on user preferences.
 *
 * - generatePersonalizedItinerary - A function that generates a customized travel itinerary.
 * - GeneratePersonalizedItineraryInput - The input type for the generatePersonalizedItinerary function.
 * - GeneratePersonalizedItineraryOutput - The return type for the generatePersonalizedItinerary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePersonalizedItineraryInputSchema = z.object({
  destination: z.string().describe('The desired travel destination.'),
  startDate: z.string().describe('The start date of the trip (e.g., "YYYY-MM-DD").'),
  endDate: z.string().describe('The end date of the trip (e.g., "YYYY-MM-DD").'),
  interests: z.array(z.string()).describe('A list of the user\u0027s travel interests (e.g., "adventure", "culture", "food").'),
  budget: z.string().describe('The user\u0027s budget level (e.g., "low", "medium", "high").'),
  travelStyle: z.string().describe('The user\u0027s preferred travel style (e.g., "relaxed", "fast-paced", "family-friendly").'),
});
export type GeneratePersonalizedItineraryInput = z.infer<typeof GeneratePersonalizedItineraryInputSchema>;

const GeneratePersonalizedItineraryOutputSchema = z.object({
  itineraryName: z.string().describe('A catchy name for the generated itinerary.'),
  summary: z.string().describe('A brief overview of the itinerary.'),
  days: z.array(
    z.object({
      dayNumber: z.number().describe('The sequential number of the day in the itinerary.'),
      date: z.string().describe('The date for this day (e.g., "YYYY-MM-DD").'),
      activities: z.array(
        z.object({
          time: z.string().describe('The time of the activity (e.g., "Morning", "10:00 AM", "Evening").'),
          description: z.string().describe('A detailed description of the activity.'),
          location: z.string().optional().describe('The specific location of the activity, if applicable.'),
          recommendations: z.string().optional().describe('Additional recommendations related to the activity (e.g., "best restaurant nearby", "local tip"), formatted as a markdown list.'),
        })
      ).describe('A list of activities planned for this day.'),
    })
  ).describe('A day-by-day breakdown of the travel plan.'),
  notes: z.string().optional().describe('Any general tips, important information, or extra notes for the traveler.'),
});
export type GeneratePersonalizedItineraryOutput = z.infer<typeof GeneratePersonalizedItineraryOutputSchema>;

export async function generatePersonalizedItinerary(input: GeneratePersonalizedItineraryInput): Promise<GeneratePersonalizedItineraryOutput> {
  return generatePersonalizedItineraryFlow(input);
}

const generatePersonalizedItineraryPrompt = ai.definePrompt({
  name: 'generatePersonalizedItineraryPrompt',
  input: { schema: GeneratePersonalizedItineraryInputSchema },
  output: { schema: GeneratePersonalizedItineraryOutputSchema },
  prompt: `You are an expert travel agent specializing in creating personalized and detailed travel itineraries.

Generate a travel itinerary based on the following user preferences:

Destination: {{{destination}}}
Start Date: {{{startDate}}}
End Date: {{{endDate}}}
Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Budget: {{{budget}}}
Travel Style: {{{travelStyle}}}

Craft a day-by-day plan, including specific activities, times, and potential recommendations for each day. Ensure the itinerary is engaging, practical, and tailored to the user's preferences.

Structure your response as a JSON object, adhering strictly to the provided output schema.
`,
});

const generatePersonalizedItineraryFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedItineraryFlow',
    inputSchema: GeneratePersonalizedItineraryInputSchema,
    outputSchema: GeneratePersonalizedItineraryOutputSchema,
  },
  async (input) => {
    const { output } = await generatePersonalizedItineraryPrompt(input);
    return output!;
  }
);
