import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaStar, FaSort, FaHotel, FaMapMarkerAlt, FaBed, FaFilter, FaRegCompass, FaHeart } from 'react-icons/fa';
import { updateNavigationState, canAccess } from '../utils/navigationState';
import BackButton from "../components/common/BackButton";

declare global {
  interface Window {
    initMap?: () => void;
    google?: typeof google;
  }
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyA81yc5Jf_TmZNIfBR2yNIjb9dJqV3umvk';

type SortOption = 'rating' | 'reviews' | 'name';

interface BookmarkedItem {
  id: string;
  type: 'attraction' | 'hotel' | 'flight';
  name: string;
  image?: string;
  details?: string;
}

const randomRange = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const Accommodations: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [hotels, setHotels] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<google.maps.places.PlaceResult | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [loading, setLoading] = useState(true);
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

<<<<<<< HEAD
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
=======
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    try {
        const response = await fetch('/api/Accommodations/showHotels', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });
      
      if (!response.ok) throw new Error('Failed to fetch accommodations');
      
      const data = await response.json();
      setAccommodations(data);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
>>>>>>> main
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
    setBookmarkedItems(newBookmarks);
    localStorage.setItem('bookmarkedItems', JSON.stringify([...newBookmarks]));
  };

  const handleHotelClick = (hotel: google.maps.places.PlaceResult) => {
    if (!map || !hotel.geometry?.location) return;

    map.panTo(hotel.geometry.location);
    map.setZoom(16);
    setSelectedHotel(hotel);
  };

  const handleContinue = () => {
    if (selectedHotel) {
      // Clear map and markers before navigation
      markers.forEach(marker => {
        marker.map = null;
      });
      setMarkers([]);
      if (map) {
        const mapDiv = mapRef.current;
        if (mapDiv) {
          mapDiv.innerHTML = '';
        }
        setMap(null);
      }

      // Format hotel data with specific fields
      const hotelData = {
        name: selectedHotel.name || '',
        rating: selectedHotel.rating || 0,
        priceLevel: selectedHotel.price_level || 0,
        price: randomRange(100, 1000), 
        openingHour: selectedHotel.opening_hours?.weekday_text?.[0] || 'Open 24/7',
        address: selectedHotel.formatted_address || selectedHotel.vicinity || '',
        locationLat: selectedHotel.geometry?.location?.lat() || 0,
        locationLng: selectedHotel.geometry?.location?.lng() || 0
      };

      localStorage.setItem('selectedAccommodation', JSON.stringify(hotelData));
      updateNavigationState('activities');
      navigate('/map');
    } else {
      alert('Please select a hotel before continuing');
    }
  };

  const sortHotels = (hotels: google.maps.places.PlaceResult[]) => {
    return [...hotels].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'reviews':
          return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton to="/flights" />
      
      <motion.div 
        className="p-6 bg-white shadow-lg sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Find Your Perfect Stay
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" />
                {JSON.parse(localStorage.getItem('selectedFlight') || '{}').destination || ''}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white px-4 py-2 pr-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="rating">Best Rating</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="name">Hotel Name</option>
                </select>
                <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Container */}
          <motion.div 
            className="lg:w-3/5"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-28">
              <div ref={mapRef} className="w-full h-[calc(100vh-8rem)] rounded-2xl shadow-xl overflow-hidden" />
            </div>
          </motion.div>

          {/* Hotels List */}
          <motion.div 
            className="lg:w-2/5 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center py-12"
                >
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
                </motion.div>
              ) : (
                sortHotels(hotels).map((hotel, index) => (
                  <motion.div
                    key={hotel.place_id || index}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative
                      ${selectedHotel?.place_id === hotel.place_id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => handleHotelClick(hotel)}
                  >
                    {/* Bookmark Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hotel.place_id) {
                          toggleBookmark({
                            id: hotel.place_id,
                            type: 'hotel',
                            name: hotel.name || '',
                            image: hotel.photos?.[0]?.getUrl(),
                            details: hotel.vicinity
                          }, e);
                        }
                      }}
                      className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
                    >
                      <FaHeart className={`w-5 h-5 ${
                        hotel.place_id && bookmarkedItems.has(hotel.place_id)
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`} />
                    </motion.button>

                    {hotel.photos?.[0] ? (
                      <img
                        src={hotel.photos[0].getUrl()}
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <FaHotel className="w-12 h-12 text-blue-600" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{hotel.name}</h3>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`${
                                  i < (hotel.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                } w-5 h-5`}
                              />
                            ))}
                            <span className="ml-2 text-gray-600">
                              {hotel.rating} ({hotel.user_ratings_total} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      {hotel.vicinity && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-blue-600" />
                          {hotel.vicinity}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Continue Button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-[1000]"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-300
            ${selectedHotel 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
              : 'bg-gray-300 cursor-not-allowed text-gray-600'}`}
          disabled={!selectedHotel}
        >
          Continue to Activities
          <FaArrowRight />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Accommodations; 