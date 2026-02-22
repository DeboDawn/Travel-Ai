import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const communityPosts = [
  {
    id: 1,
    user: 'Alex R.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    caption: 'Sunset in Santorini was breathtaking! A must-see.',
    image: PlaceHolderImages.find((img) => img.id === 'community-1'),
  },
  {
    id: 2,
    user: 'Maria G.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    caption: 'Exploring the vibrant streets of Tokyo. The food is incredible!',
    image: PlaceHolderImages.find((img) => img.id === 'community-2'),
  },
  {
    id: 3,
    user: 'John D.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    caption: 'Hiking through the Scottish Highlands. So much green!',
    image: PlaceHolderImages.find((img) => img.id === 'community-3'),
  },
  {
    id: 4,
    user: 'Emily S.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
    caption: 'Found this hidden beach in Thailand. Paradise on Earth.',
    image: PlaceHolderImages.find((img) => img.id === 'community-4'),
  },
  {
    id: 5,
    user: 'Chen W.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
    caption: 'The Great Wall of China is even more majestic in person.',
    image: PlaceHolderImages.find((img) => img.id === 'community-5'),
  },
  {
    id: 6,
    user: 'Fatima A.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c',
    caption: 'Lost in the beauty of Moroccan markets.',
    image: PlaceHolderImages.find((img) => img.id === 'community-6'),
  },
];

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Community Travel Feed"
        description="Get inspired by the adventures of fellow travelers from around the globe."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {communityPosts.map((post) =>
          post.image ? (
            <Card key={post.id} className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="aspect-h-1 aspect-w-1">
                  <Image
                    src={post.image.imageUrl}
                    alt={post.image.description}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={post.image.imageHint}
                  />
                </div>
              </CardContent>
              <CardFooter className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.avatar} alt={post.user} />
                    <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.user}</p>
                    <p className="text-sm text-muted-foreground">{post.caption}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ) : null
        )}
      </div>
    </div>
  );
}
