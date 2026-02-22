import { PageHeader } from '@/components/page-header';
import MapView from '@/components/map-view';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function MapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <PageHeader
        title="Interactive Map"
        description="Explore points of interest, restaurants, and your planned activities."
      />
      <div className="flex-grow rounded-lg overflow-hidden shadow-lg">
        {apiKey ? (
          <MapView apiKey={apiKey} />
        ) : (
          <div className="h-full flex items-center justify-center bg-muted">
             <Alert variant="destructive" className="max-w-md">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Google Maps API Key Missing</AlertTitle>
                <AlertDescription>
                    To display the interactive map, please add your Google Maps API Key as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to your environment variables.
                </AlertDescription>
             </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
