import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bot,
  Globe,
  Languages,
  LayoutGrid,
  MoveUpRight,
  Route,
  Scan,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    title: 'Itinerary Generator',
    description: 'Craft your perfect trip with an AI-generated itinerary.',
    href: '/itinerary-generator',
    icon: <Route className="size-8 text-primary" />,
  },
  {
    title: 'Travel Assistant',
    description: 'Ask our AI anything about your destination.',
    href: '/travel-assistant',
    icon: <Bot className="size-8 text-primary" />,
  },
  {
    title: 'Phrasebook',
    description: 'Translate common phrases with real-time AI.',
    href: '/phrasebook',
    icon: <Languages className="size-8 text-primary" />,
  },
  {
    title: 'AR Scanner',
    description: "Discover stories behind landmarks (Demo).",
    href: '/ar-scanner',
    icon: <Scan className="size-8 text-primary" />,
  },
  {
    title: 'Community',
    description: 'Share and explore travel stories from our community.',
    href: '/community',
    icon: <Users className="size-8 text-primary" />,
  },
];

const heroImage = PlaceHolderImages.find((img) => img.id === 'home-hero');

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative w-full h-[40vh] md:h-[50vh]">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="relative h-full flex flex-col items-center justify-center text-center text-primary-foreground px-4">
             <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <Globe className="size-12" />
                    <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
                        WanderWise
                    </h1>
                </div>
                <p className="max-w-2xl text-lg md:text-xl text-primary-foreground/90">
                Your AI-powered travel companion for seamless adventures.
                </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Link key={feature.title} href={feature.href} className="group">
                  <Card className="h-full hover:bg-card/80 transition-colors hover:shadow-lg flex flex-col">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div className="space-y-1.5">
                        <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                      {feature.icon}
                    </CardHeader>
                    <CardContent className="mt-auto">
                        <div className="text-sm font-medium text-primary flex items-center group-hover:underline">
                            Open Feature <MoveUpRight className="size-4 ml-1" />
                        </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
