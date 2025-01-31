import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

declare global {
  interface Window {
    initMap?: () => void;
    google?: typeof google;
  }
}

interface MarkerLibrary {
  AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyA81yc5Jf_TmZNIfBR2yNIjb9dJqV3umvk';

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [center] = useState({ lat: 40.7128, lng: -74.0060 });
  const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [attractions, setAttractions] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedAttraction, setSelectedAttraction] = useState<google.maps.places.PlaceResult | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [attractionType, setAttractionType] = useState<AttractionType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [selectedAttractions, setSelectedAttractions] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<{
    mustSee: google.maps.places.PlaceResult[];
    popular: google.maps.places.PlaceResult[];
  }>({
    mustSee: [],
    popular: []
  });
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Add this helper function at the top of the component
  const cleanupGoogleMapsScript = () => {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      const script = scripts[i];
      if (script.src.includes('maps.googleapis.com') || script.id === 'google-maps-script') {
        script.remove();
      }
    }
  };

  // Initialize map only once
  useEffect(() => {
    if (!canAccess('activities')) {
      navigate('/flights');
      return;
    }

    const hotelData = JSON.parse(localStorage.getItem('selectedAccommodation') || '{}');
    if (!hotelData.geometry?.location) {
      navigate('/accommodations');
      return;
    }

    // Clean up any existing Google Maps scripts
    cleanupGoogleMapsScript();

        // Load the Maps JavaScript API
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.id = 'google-maps-script';
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
          script.async = true;
          
          window.initMap = () => {
            if (mapRef.current) {
              const newMap = new google.maps.Map(mapRef.current, {
                center,
                zoom: 12,
                mapId: 'REPLACE_WITH_YOUR_MAP_ID'
              });
              setMap(newMap);
            }
            resolve();
          };

          script.onerror = () => reject(new Error('Failed to load Google Maps script'));
          document.head.appendChild(script);
        });

      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    loadGoogleMaps();

    return () => {
      // Cleanup function
      cleanupGoogleMapsScript();
      
      // Clear all markers
      markers.forEach(marker => {
        if (marker) marker.setMap(null);
      });
      setMarkers([]);
      
      // Clear the map instance
      if (map) {
        const mapDiv = mapRef.current;
        if (mapDiv) {
          mapDiv.innerHTML = '';
        }
        setMap(null);
      }
    };
  }, [navigate]); // Only run on mount and navigation changes

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedItems');
    if (savedBookmarks) {
      setBookmarkedItems(new Set(JSON.parse(savedBookmarks)));
    }
  }, []);

  const handleSearch = () => {
    if (!map) return;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, async (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const newCenter = { lat: location.lat(), lng: location.lng() };
        map.panTo(newCenter);

        // Remove existing marker if any
        if (marker) {
          (marker as any).setMap(null);
        }

        // Create new AdvancedMarkerElement
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        const newMarker = new AdvancedMarkerElement({
          map,
          position: newCenter,
          title: searchQuery
        });
        setMarker(newMarker);

        // Search for nearby attractions
        const service = new google.maps.places.PlacesService(map);
        const request = {
          location: newCenter,
          radius: 10000,
          type: 'tourist_attraction'
        } as google.maps.places.PlaceSearchRequest;

        service.nearbySearch(request, (places, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && places) {
            const maxPlaces = Math.min(Math.max(places.length, 20), 30);
            setAttractions(places.slice(0, maxPlaces));
          }
        });
      }
    });
  };

  const getCurrentLocation = () => {
    if (!map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.panTo(newCenter);

        // Remove existing marker if any
        if (marker) {
          (marker as any).setMap(null);
        }

        // Create new AdvancedMarkerElement
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        const newMarker = new AdvancedMarkerElement({
          map,
          position: newCenter,
          title: searchQuery
        });
        setMarker(newMarker);
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Add a function to handle card clicks
  const handleAttractionClick = async (place: google.maps.places.PlaceResult) => {
    if (!map || !place.geometry?.location) return;

    // Pan map to the attraction location
    map.panTo(place.geometry.location);
    map.setZoom(15); // Zoom in closer

    // Remove existing marker
    if (marker) {
      (marker as any).setMap(null);
    }

    // Create new marker for the attraction
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const newMarker = new AdvancedMarkerElement({
      map,
      position: place.geometry.location,
      title: place.name
    });
    setMarker(newMarker);
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header and Controls Section */}
      <div className="bg-white p-4 shadow-md mb-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-gray-800 mb-3">
            Find Your Perfect Vacation Spot
          </h1>
          
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-white rounded-lg border border-gray-300">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a location..."
                className="w-full p-2 rounded-l-lg outline-none"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
              >
                <FaSearch />
              </button>
            </div>
            <button
              onClick={getCurrentLocation}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <FaMapMarkerAlt />
              <span className="hidden sm:inline">Current Location</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 px-4 mb-4">
        <div ref={mapRef} className="w-full h-[400px] rounded-lg shadow-md" />
      </div>

      {/* Attractions Section */}
      {attractions.length > 0 && (
        <div className="px-4 pb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Popular Attractions Nearby
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {attractions.map((place, index) => (
              <div 
                key={place.place_id || index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleAttractionClick(place)}
              >
                {place.photos?.[0] && (
                  <img
                    src={place.photos[0].getUrl()}
                    alt={place.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{place.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaSearch
                          key={i}
                          className={i < (place.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      {place.rating} ({place.user_ratings_total} reviews)
                    </span>
                  </div>
                  {place.vicinity && (
                    <p className="text-gray-600">{place.vicinity}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;