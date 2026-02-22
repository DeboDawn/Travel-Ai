'use client';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

const points = [
  { id: 1, lat: 48.8584, lng: 2.2945, name: 'Eiffel Tower' },
  { id: 2, lat: 48.8606, lng: 2.3376, name: 'Louvre Museum' },
  { id: 3, lat: 48.8530, lng: 2.3499, name: 'Notre-Dame Cathedral' },
];

export default function MapView({ apiKey }: { apiKey: string }) {
  const position = { lat: 48.8566, lng: 2.3522 }; // Paris

  return (
    <APIProvider apiKey={apiKey}>
        <div style={{ height: '100%', width: '100%' }}>
            <Map 
                defaultCenter={position} 
                defaultZoom={12} 
                mapId="wanderwise_map"
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            >
                {points.map(point => (
                    <Marker key={point.id} position={{lat: point.lat, lng: point.lng}} title={point.name}/>
                ))}
            </Map>
        </div>
    </APIProvider>
  );
}
