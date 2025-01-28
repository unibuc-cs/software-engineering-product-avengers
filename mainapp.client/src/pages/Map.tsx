import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

interface Location {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  type: string;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyDpmvq2oubtD-ycAz6OHlotF8IcAeO6JCo';

const Map: React.FC = () => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [locations] = useState<Location[]>([
    {
      id: '1',
      name: 'Eiffel Tower',
      position: { lat: 48.8584, lng: 2.2945 },
      type: 'attraction'
    },
    {
      id: '2',
      name: 'Louvre Museum',
      position: { lat: 48.8606, lng: 2.3376 },
      type: 'museum'
    }
  ]);

  // Load Google Maps Script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = () => setIsLoading(false);
        script.onerror = () => setError('Failed to load Google Maps');
        document.head.appendChild(script);
      } else {
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, []);

  // Initialize Map
  useEffect(() => {
    if (isLoading || !window.google || !mapRef.current || map) return;

    try {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      setMap(newMap);
    } catch (err) {
      setError('Error initializing map');
      console.error(err);
    }
  }, [isLoading, map]);

  // Add Markers
  useEffect(() => {
    if (!map) return;

    locations.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: location.position,
        map,
        title: location.name,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold">${location.name}</h3>
            <p class="text-sm text-gray-600">${location.type}</p>
            <button class="mt-2 text-blue-600 hover:text-blue-800">Add to Itinerary</button>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });
  }, [map, locations]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Explore Destinations</h1>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search locations..."
              className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FaMapMarkerAlt />
            Current Location
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-[70vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div ref={mapRef} style={{ height: '70vh', width: '100%' }} />
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {locations.map(location => (
          <div key={location.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-bold">{location.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{location.type}</p>
            <button className="mt-2 text-blue-600 hover:text-blue-800">
              Add to Itinerary
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Map;