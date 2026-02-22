import { config } from 'dotenv';
config();

import '@/ai/flows/translate-travel-phrases.ts';
import '@/ai/flows/get-travel-recommendations.ts';
import '@/ai/flows/generate-personalized-itinerary.ts';