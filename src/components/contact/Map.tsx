'use client';

import { LoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import { Skeleton } from '@/components/ui/skeleton';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

const center = {
  lat: 44.4355, // Coordinates for Strada Regina Elisabeta 61, Bucharest
  lng: 26.1007,
};

export function Map() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key is not set. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.');
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Harta nu poate fi încărcată. Vă rugăm să verificați configurarea cheii API.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <LoadScript
        googleMapsApiKey={apiKey}
        loadingElement={<Skeleton className="w-full h-[400px]" />}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={17}
          options={{
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
        >
          <MarkerF 
            position={center} 
            title="Cafeteca Cismigiu"
            icon={{
              url: '/map-marker.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
