'use client';

import { getTravelRecommendations } from '@/ai/flows/get-travel-recommendations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Bot, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/page-header';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  destination: z.string().min(2, { message: 'Destination is required.' }),
  question: z.string().min(10, { message: 'Question must be at least 10 characters.' }),
});

type Message = {
  role: 'user' | 'assistant';
  content: string;
  destination?: string;
};

export default function TravelAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      question: '',
    },
  });

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: values.question, destination: values.destination };
    setMessages((prev) => [...prev, userMessage]);
    form.reset({ destination: values.destination, question: '' });

    try {
      const result = await getTravelRecommendations({
        destination: values.destination,
        question: values.question,
      });
      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error getting recommendation',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
      setMessages(prev => prev.slice(0, -1)); // Remove user message if API fails
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <PageHeader
        title="AI Travel Assistant"
        description="Your personal guide for any travel-related questions."
      />
      <div className="flex-1 flex flex-col min-h-0">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Chat with WanderWise</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-16">
                    <Bot className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Ask me anything about your travel plans!</p>
                    <p className="text-sm text-muted-foreground/80">e.g., "What are some hidden gems in Tokyo?"</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <Sparkles />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-xl rounded-lg p-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                      {message.role === 'user' && message.destination && (
                          <p className="text-sm font-bold opacity-80 mb-2">Destination: {message.destination}</p>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                        <Avatar>
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
               <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Tokyo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What are the best vegan restaurants?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Message
              </Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}
