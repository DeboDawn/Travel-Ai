'use client';

import { translateTravelPhrase } from '@/ai/flows/translate-travel-phrases';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Languages, ArrowRight, Volume2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

const languages = [
    { code: 'Spanish', name: 'Spanish' },
    { code: 'French', name: 'French' },
    { code: 'German', name: 'German' },
    { code: 'Italian', name: 'Italian' },
    { code: 'Japanese', name: 'Japanese' },
    { code: 'Mandarin Chinese', name: 'Mandarin Chinese' },
    { code: 'Korean', name: 'Korean' },
    { code: 'Arabic', name: 'Arabic' },
];

const formSchema = z.object({
  phrase: z.string().min(1, { message: 'Please enter a phrase to translate.' }),
  targetLanguage: z.string({ required_error: 'Please select a language.' }),
});

export default function PhrasebookPage() {
  const [translation, setTranslation] = useState<{ original: string; translated: string; language: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phrase: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTranslation(null);
    try {
      const result = await translateTravelPhrase(values);
      setTranslation({
        original: values.phrase,
        translated: result.translatedPhrase,
        language: values.targetLanguage,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error translating phrase',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSpeak = (text: string, lang: string) => {
    if (!isClient || !window.speechSynthesis) {
        toast({
            title: 'Text-to-speech not available',
            description: 'Your browser may not support this feature.',
            variant: 'destructive'
        });
        return;
    }
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        // This is a simplistic mapping. Full BCP 47 codes would be better.
        const langMap: { [key: string]: string } = {
            'spanish': 'es', 'french': 'fr', 'german': 'de', 'italian': 'it', 'japanese': 'ja', 'mandarin chinese': 'zh-CN', 'korean': 'ko', 'arabic': 'ar'
        };
        const langCode = langMap[lang.toLowerCase()] || 'en-US';
        utterance.lang = langCode;
        speechSynthesis.speak(utterance);
    } catch (error) {
        toast({
            title: 'Text-to-speech failed',
            description: 'Could not play the audio for the selected language.',
            variant: 'destructive'
        })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Multilingual Phrasebook"
        description="Break language barriers with instant AI-powered translations."
      />
      <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Translate a Phrase</CardTitle>
          <CardDescription>Enter a phrase and select the language to translate it into.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phrase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phrase in English</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Where is the nearest train station?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Translate to</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : 'Translate'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isLoading || translation) && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Translation Result</CardTitle>
            </CardHeader>
            <CardContent>
            {isLoading ? (
                 <div className="flex items-center justify-center text-center space-x-4 py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Generating translation...</p>
                 </div>
            ) : translation && (
                <div className="space-y-6">
                    <div>
                        <FormLabel className="text-sm text-muted-foreground">Original (English)</FormLabel>
                        <p className="text-lg font-semibold mt-1">{translation.original}</p>
                    </div>

                    <div className="flex justify-center items-center">
                        <ArrowRight className="size-6 text-muted-foreground"/>
                    </div>
                    
                    <div>
                        <FormLabel className="text-sm text-muted-foreground">Translated ({translation.language})</FormLabel>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-primary mt-1">{translation.translated}</p>
                            {isClient && window.speechSynthesis && (
                                <Button variant="ghost" size="icon" onClick={() => handleSpeak(translation.translated, translation.language)}>
                                    <Volume2 className="size-6" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            </CardContent>
        </Card>
      )}

      {!isLoading && !translation && (
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-16 text-muted-foreground">
            <Languages className="size-12 opacity-50"/>
            <p>Your translated phrase will appear here.</p>
        </div>
      )}
      </div>
    </div>
  );
}
