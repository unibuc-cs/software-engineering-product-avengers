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
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]); // Track markers

  // Load Google Maps Script only once
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        // If Google Maps is already loaded, return early
        setIsLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setIsLoading(false);
      script.onerror = () => setError('Failed to load Google Maps');
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize Map and Places Service
  useEffect(() => {
    if (isLoading || !window.google || !mapRef.current || map) return;

    try {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 }, // Default to Paris
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      setMap(newMap);

      // Initialize PlacesService for location search
      const service = new window.google.maps.places.PlacesService(newMap);
      setPlacesService(service);
    } catch (err) {
      setError('Error initializing map');
      console.error(err);
    }
  }, [isLoading, map]);

  // Handle Search
  const handleSearch = () => {
    if (!searchQuery || !placesService || !map) return;

    // Use the PlacesService to search for the place
    const request = {
      query: searchQuery,
      fields: ['name', 'geometry'],
    };

    placesService.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        // Remove existing markers from the map
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]); // Clear the markers state

        // Get the first result (most relevant)
        const place = results[0];
        const { geometry, name } = place;

        if (geometry && geometry.location) {
          const latLng = geometry.location;

          // Center the map on the searched place
          map.setCenter(latLng);
          map.setZoom(14);

          // Add a marker for the searched location
          const marker = new window.google.maps.Marker({
            position: latLng,
            map,
            title: name,
          });

          // Add the marker to the markers state
          setMarkers(prevMarkers => [...prevMarkers, marker]);
        }
      } else {
        alert('Location not found!');
      }
    });
  };

  // Handle Current Location button click
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latLng = new window.google.maps.LatLng(latitude, longitude);

          map?.setCenter(latLng);
          map?.setZoom(14);

          // Remove existing markers
          markers.forEach(marker => marker.setMap(null));
          setMarkers([]); // Clear markers state

          // Add a marker for the user's current location
          const marker = new window.google.maps.Marker({
            position: latLng,
            map,
            title: 'Your Current Location',
          });

          // Add the marker to the markers state
          setMarkers(prevMarkers => [...prevMarkers, marker]);
        },
        () => alert('Error getting your location.')
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

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
            <FaSearch
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            />
          </div>
          <button
            onClick={handleCurrentLocation}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
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
    </motion.div>
  );
};

export default Map;
