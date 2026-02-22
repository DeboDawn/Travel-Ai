'use server';
/**
 * @fileOverview A Genkit flow for translating travel phrases into a target language.
 *
 * - translateTravelPhrase - A function that handles the translation process.
 * - TranslateTravelPhraseInput - The input type for the translateTravelPhrase function.
 * - TranslateTravelPhraseOutput - The return type for the translateTravelPhrase function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateTravelPhraseInputSchema = z.object({
  phrase: z.string().describe('The phrase or question to translate.'),
  targetLanguage: z.string().describe('The language into which the phrase should be translated.'),
});
export type TranslateTravelPhraseInput = z.infer<typeof TranslateTravelPhraseInputSchema>;

const TranslateTravelPhraseOutputSchema = z.object({
  translatedPhrase: z.string().describe('The translated phrase or question.'),
});
export type TranslateTravelPhraseOutput = z.infer<typeof TranslateTravelPhraseOutputSchema>;

export async function translateTravelPhrase(input: TranslateTravelPhraseInput): Promise<TranslateTravelPhraseOutput> {
  return translateTravelPhraseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTravelPhrasePrompt',
  input: { schema: TranslateTravelPhraseInputSchema },
  output: { schema: TranslateTravelPhraseOutputSchema },
  prompt: `You are a highly skilled multilingual translator specializing in travel phrases.

Translate the following phrase into {{targetLanguage}}.

Phrase: "{{phrase}}"

Only return the translated phrase, without any additional conversational text or explanations.`,
});

const translateTravelPhraseFlow = ai.defineFlow(
  {
    name: 'translateTravelPhraseFlow',
    inputSchema: TranslateTravelPhraseInputSchema,
    outputSchema: TranslateTravelPhraseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
