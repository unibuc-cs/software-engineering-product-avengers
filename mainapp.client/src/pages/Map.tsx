import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

interface Location {
  id: string;
  name: string;
  address: string;
  photoUrl: string;
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
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]); 
  const [locations, setLocations] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
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

  useEffect(() => {
    if (isLoading || !window.google || !mapRef.current || map) return;

    try {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 }, 
        zoom: 13,
      });

      setMap(newMap);
      setPlacesService(new window.google.maps.places.PlacesService(newMap));
    } catch (err) {
      setError('Error initializing map');
      console.error(err);
    }
  }, [isLoading, map]);

  const searchNearbyPlaces = (latLng: google.maps.LatLng) => {
    if (!placesService) return;

    setLocations([]); // Clear previous locations
    let completedSearches = 0;
    const placeTypes = ['tourist_attraction', 'museum', 'church', 'park', 'zoo', 'national_park', 'aquarium', 'art_gallery', 'library', 'movie_theater'];
    
    placeTypes.forEach((type, index) => {
      setTimeout(() => {
        const placesRequest = {
          location: latLng,
          radius: 5000,
          type: type,
        };

        placesService.nearbySearch(placesRequest, (places, status) => {
          completedSearches++;
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && places) {
            const locationsData: Location[] = places.map(place => ({
              id: place.place_id || `fallback-${place.name || 'unknown'}`,
              name: place.name || 'Unknown',
              address: place.vicinity || 'N/A',
              position: {
                lat: place.geometry?.location?.lat?.() ?? 0,
                lng: place.geometry?.location?.lng?.() ?? 0,
              },
              photoUrl: place.photos ? place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) : '',
              type: place.types?.join(', ') || 'Unknown',
            }));

            setLocations(prev => [...prev, ...locationsData]);
          }

          if (completedSearches === placeTypes.length) {
            setIsSearching(false);
          }
        });
      }, index * 500);
    });
  };

  const handleSearch = () => {
    if (!searchQuery || !placesService || !map) return;
    
    setIsSearching(true);
    const request = {
      query: searchQuery,
      fields: ['name', 'geometry', 'formatted_address', 'photos'],
    };
  
    placesService.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);
  
        const place = results[0];
        const { geometry } = place;
  
        if (geometry && geometry.location) {
          const latLng = geometry.location;
          map.setCenter(latLng);
          map.setZoom(14);
  
          const marker = new window.google.maps.Marker({
            position: latLng,
            map,
            title: place.name,
          });
  
          setMarkers([marker]);
          searchNearbyPlaces(latLng);
        }
      } else {
        setIsSearching(false);
        alert('Location not found!');
      }
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latLng = new window.google.maps.LatLng(latitude, longitude);

          map?.setCenter(latLng);
          map?.setZoom(14);

          markers.forEach(marker => marker.setMap(null));
          setMarkers([]);

          const marker = new window.google.maps.Marker({
            position: latLng,
            map,
            title: 'Your Current Location',
          });

          setMarkers([marker]);
          searchNearbyPlaces(latLng);
        },
        () => {
          setIsSearching(false);
          alert('Error getting your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleLocationClick = (location: Location) => {
    if (!map) return;

    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const latLng = new window.google.maps.LatLng(location.position.lat, location.position.lng);
    map.setCenter(latLng);
    map.setZoom(15);

    const marker = new window.google.maps.Marker({
      position: latLng,
      map,
      title: location.name,
    });

    setMarkers([marker]);
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
              className="w-full p-3 pr-10 rounded-lg border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <FaSearch 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" 
              onClick={handleSearch} 
            />
          </div>
          <button 
            onClick={handleCurrentLocation} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <FaMapMarkerAlt /> Current Location
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

      {isSearching ? (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : locations.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div 
              key={location.id} 
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => handleLocationClick(location)}
            >
              {location.photoUrl && (
                <img 
                  src={location.photoUrl} 
                  alt={location.name} 
                  className="w-full h-40 object-cover rounded-lg mb-4" 
                />
              )}
              <h3 className="text-xl font-semibold">{location.name}</h3>
              <p className="text-gray-600">{location.address}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Map;