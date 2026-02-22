'use client';

import { generatePersonalizedItinerary } from '@/ai/flows/generate-personalized-itinerary';
import type { GeneratePersonalizedItineraryOutput } from '@/ai/flows/generate-personalized-itinerary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { PageHeader } from '@/components/page-header';

const interests = [
    { id: 'adventure', label: 'Adventure' },
    { id: 'culture', label: 'Culture' },
    { id: 'food', label: 'Food' },
    { id: 'relaxation', label: 'Relaxation' },
    { id: 'nightlife', label: 'Nightlife' },
    { id: 'history', label: 'History' },
] as const;

const formSchema = z.object({
  destination: z.string().min(2, { message: 'Destination must be at least 2 characters.' }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Please enter a date in YYYY-MM-DD format.' }),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Please enter a date in YYYY-MM-DD format.' }),
  interests: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one interest.',
  }),
  budget: z.enum(['low', 'medium', 'high']),
  travelStyle: z.enum(['relaxed', 'fast-paced', 'family-friendly']),
});

export default function ItineraryGeneratorPage() {
  const [itinerary, setItinerary] = useState<GeneratePersonalizedItineraryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      startDate: '',
      endDate: '',
      interests: [],
      budget: 'medium',
      travelStyle: 'relaxed',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setItinerary(null);
    try {
      const result = await generatePersonalizedItinerary(values);
      setItinerary(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating itinerary',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Personalized Itinerary Generator"
        description="Fill out your travel preferences and let our AI craft the perfect journey for you."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Trip Details</CardTitle>
              <CardDescription>Tell us what you&apos;re looking for.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Paris, France" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input placeholder="YYYY-MM-DD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input placeholder="YYYY-MM-DD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="interests"
                    render={() => (
                      <FormItem>
                         <FormLabel>Interests</FormLabel>
                         <div className="grid grid-cols-2 gap-2">
                         {interests.map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name="interests"
                                render={({ field }) => {
                                return (
                                    <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...field.value, item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.id
                                                )
                                            )
                                        }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item.label}
                                    </FormLabel>
                                    </FormItem>
                                )
                                }}
                            />
                            ))}
                         </div>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                   <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your budget" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Budget-friendly</SelectItem>
                            <SelectItem value="medium">Standard</SelectItem>
                            <SelectItem value="high">Luxury</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="travelStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travel Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your travel style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="relaxed">Relaxed</SelectItem>
                            <SelectItem value="fast-paced">Fast-paced</SelectItem>
                            <SelectItem value="family-friendly">Family-friendly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Itinerary
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card className="min-h-full">
            <CardHeader>
                <CardTitle>Your AI-Generated Itinerary</CardTitle>
                <CardDescription>Here is your personalized plan.</CardDescription>
            </CardHeader>
            <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Crafting your perfect adventure...</p>
            </div>
          )}
          {itinerary && (
            <div className="space-y-6">
                <div className="p-4 bg-primary/10 rounded-lg">
                    <h2 className="text-2xl font-bold font-headline text-primary">{itinerary.itineraryName}</h2>
                    <p className="text-muted-foreground mt-2">{itinerary.summary}</p>
                </div>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {itinerary.days.map((day, index) => (
                  <AccordionItem key={day.dayNumber} value={`item-${index}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center font-bold">{day.dayNumber}</div>
                        <span className="font-bold">Day {day.dayNumber}</span>
                        <span className="text-muted-foreground ml-4">{day.date}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pl-4 border-l-2 border-primary ml-4">
                        {day.activities.map((activity, activityIndex) => (
                          <div key={activityIndex} className="relative">
                            <div className="absolute -left-[27px] top-1.5 size-4 bg-background border-2 border-primary rounded-full"></div>
                            <p className="font-semibold flex items-center gap-2"><Clock className="size-4 text-muted-foreground"/> {activity.time}</p>
                            <p className="mt-1">{activity.description}</p>
                            {activity.location && <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="size-3"/>{activity.location}</p>}
                            {activity.recommendations && (
                                <div className="mt-2 text-sm bg-accent/20 p-2 rounded-md">
                                    <h4 className="font-semibold flex items-center gap-1"><Sparkles className="size-3 text-accent"/> Recommendations</h4>
                                    <div className="mt-1 whitespace-pre-wrap">
                                        {activity.recommendations}
                                    </div>
                                </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
               {itinerary.notes && (
                    <div className="mt-6 p-4 bg-card rounded-lg border">
                        <h3 className="font-bold text-lg">Extra Notes & Tips</h3>
                        <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{itinerary.notes}</p>
                    </div>
                )}
            </div>
          )}
          {!isLoading && !itinerary && (
             <div className="flex flex-col items-center justify-center text-center space-y-4 py-16">
              <Calendar className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Your itinerary will appear here once generated.</p>
            </div>
          )}
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
