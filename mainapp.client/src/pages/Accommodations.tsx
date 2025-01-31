import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Accommodation {
  id: string;
  name: string;
  type: string;
  price: number;
  rating: number;
  image: string;
  location: string;
}

const Accommodations: React.FC = () => {
  const [filters, setFilters] = useState({
    priceRange: '',
    type: '',
    rating: '',
    location: '',
  });

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

  // Protection against direct access
  useEffect(() => {
    if (!canAccess('accommodations')) {
      navigate('/flights');
      return;
    }

    const flightData = JSON.parse(localStorage.getItem('selectedFlight') || '{}');
    if (!flightData.destination) {
      navigate('/flights');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const existingScript = document.getElementById('google-maps-script');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }

        const flightData = JSON.parse(localStorage.getItem('selectedFlight') || '{}');
        const destination = flightData.destination;

        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.id = 'google-maps-script';
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
          script.async = true;
          script.defer = true;
          
          let mapInstance: google.maps.Map | null = null;

          window.initMap = () => {
            if (mapRef.current) {
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ address: destination }, async (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  const location = results[0].geometry.location;
                  mapInstance = new google.maps.Map(mapRef.current!, {
                    center: location,
                    zoom: 14,
                    mapId: 'DEMO_MAP_ID',
                    styles: [
                      {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }]
                      }
                    ]
                  });
                  setMap(mapInstance);

                  const service = new google.maps.places.PlacesService(mapInstance);
                  const request = {
                    location: location,
                    radius: 15000,
                    type: 'lodging',
                    rankBy: google.maps.places.RankBy.PROMINENCE
                  } as google.maps.places.PlaceSearchRequest;

                  service.nearbySearch(request, async (places, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && places) {
                      const sortedHotels = sortHotels(places);
                      setHotels(sortedHotels);
                      
                      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
                      const newMarkers = sortedHotels.map(place => {
                        if (place.geometry?.location) {
                          const marker = new AdvancedMarkerElement({
                            map: mapInstance,
                            position: place.geometry.location,
                            title: place.name
                          });
                          
                          marker.addListener('click', () => handleHotelClick(place));
                          return marker;
                        }
                        return null;
                      }).filter(Boolean) as google.maps.marker.AdvancedMarkerElement[];
                      
                      setMarkers(newMarkers);
                    }
                    setLoading(false);
                  });
                }
              });
            }
            resolve();
          };

          script.onerror = () => reject(new Error('Failed to load Google Maps script'));
          document.head.appendChild(script);
        });

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
      // Cleanup function
      const script = document.getElementById('google-maps-script');
      if (script) {
        document.head.removeChild(script);
      }
      // Clear all markers by removing them from the map
      markers.forEach(marker => {
        marker.map = null;
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
  }, [sortBy]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedItems');
    if (savedBookmarks) {
      setBookmarkedItems(new Set(JSON.parse(savedBookmarks)));
    }
  }, []);

  // Toggle bookmark
  const toggleBookmark = (item: BookmarkedItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(item.id)) {
      newBookmarks.delete(item.id);
    } else {
      newBookmarks.add(item.id);
      // Placeholder for API call
      console.log('Bookmark added:', item);
      // TODO: Add API call to save bookmark
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Stay</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleFilterChange}
            className="border rounded-lg p-2"
          >
            <option value="">Price Range</option>
            <option value="budget">Budget ($0-$100)</option>
            <option value="moderate">Moderate ($100-$200)</option>
            <option value="luxury">Luxury ($200+)</option>
          </select>

          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="border rounded-lg p-2"
          >
            <option value="">Accommodation Type</option>
            <option value="hotel">Hotel</option>
            <option value="apartment">Apartment</option>
            <option value="resort">Resort</option>
            <option value="hostel">Hostel</option>
          </select>

          <select
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
            className="border rounded-lg p-2"
          >
            <option value="">Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>

          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="border rounded-lg p-2"
          >
            <option value="">Location</option>
            <option value="city-center">City Center</option>
            <option value="beach">Beach</option>
            <option value="suburban">Suburban</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search Accommodations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accommodations.map((accommodation) => (
          <motion.div
            key={accommodation.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            whileHover={{ y: -5 }}
          >
            <img
              src={accommodation.image}
              alt={accommodation.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{accommodation.name}</h3>
              <p className="text-gray-600 mb-2">{accommodation.location}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ${accommodation.price}/night
                </span>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{accommodation.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Accommodations; 