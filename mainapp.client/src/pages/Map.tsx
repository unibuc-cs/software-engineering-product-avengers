import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaStar, FaUtensils, FaLandmark, FaTheaterMasks, FaTree, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { updateNavigationState, canAccess } from '../utils/navigationState';
import BackButton from "../components/common/BackButton";

declare global {
  interface Window {
    initMap?: () => void;
    google?: typeof google;
  }
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyA81yc5Jf_TmZNIfBR2yNIjb9dJqV3umvk';

type AttractionType = 'all' | 'restaurant' | 'museum' | 'tourist_attraction' | 'park';
type SortOption = 'rating' | 'reviews' | 'name';
type PlaceType = 'tourist_attraction' | 'restaurant' | 'museum' | 'park';

const PLACE_TYPES = {
  tourist_attraction: { label: 'Tourist Spots', icon: <FaLandmark className="w-5 h-5" /> },
  restaurant: { label: 'Restaurants', icon: <FaUtensils className="w-5 h-5" /> },
  museum: { label: 'Museums', icon: <FaTheaterMasks className="w-5 h-5" /> },
  park: { label: 'Parks', icon: <FaTree className="w-5 h-5" /> }
};

interface BookmarkedItem {
  id: string;
  type: 'attraction' | 'hotel' | 'flight';
  name: string;
  image?: string;
  details?: string;
}

const Map: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
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

    // Create the script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    let mapInstance: google.maps.Map | null = null;

    script.onload = () => {
      const hotelData = JSON.parse(localStorage.getItem('selectedAccommodation') || '{}');
      const geocoder = new google.maps.Geocoder();
      
      // Get the city name from the flight data
      const flightData = JSON.parse(localStorage.getItem('selectedFlight') || '{}');
      const cityName = flightData.destination;

      // First geocode the city center
      geocoder.geocode({ address: cityName }, (cityResults, cityStatus) => {
        if (cityStatus === 'OK' && cityResults && cityResults[0]) {
          const cityCenter = cityResults[0].geometry.location;

          if (mapRef.current) {
            mapInstance = new google.maps.Map(mapRef.current, {
              center: cityCenter,
              zoom: 13,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              fullscreenControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              zoomControl: true
            });
            setMap(mapInstance);

            // Add a marker for the hotel
            if (hotelData.geometry?.location) {
              const marker = new (google.maps.Marker as any)({
                map: mapInstance,
                position: new google.maps.LatLng(
                  hotelData.geometry.location.lat,
                  hotelData.geometry.location.lng
                ),
                title: 'Your Hotel',
                icon: {
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }
              });
            }
          }
        }
      });
    };

    script.onerror = (error) => {
      console.error('Error loading Google Maps:', error);
    };

    document.head.appendChild(script);

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

  // Load attractions whenever the map or attraction type changes
  useEffect(() => {
    if (!map) return;

    const hotelData = JSON.parse(localStorage.getItem('selectedAccommodation') || '{}');
    if (!hotelData.geometry?.location) return;

    const hotelLocation = new google.maps.LatLng(
      hotelData.geometry.location.lat,
      hotelData.geometry.location.lng
    );

    const loadAttractions = async () => {
      const service = new google.maps.places.PlacesService(map);
      const types = attractionType === 'all' 
        ? Object.keys(PLACE_TYPES)
        : [attractionType];

      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      setMarkers([]);
      setAttractions([]); // Clear existing attractions when changing type

      try {
        const requests = types.map(type => {
          const request: google.maps.places.PlaceSearchRequest = {
            location: hotelLocation,
            radius: 5000,
            type: type as PlaceType,
            rankBy: google.maps.places.RankBy.PROMINENCE,
            keyword: type === 'tourist_attraction' ? 'tourist landmark monument attraction' : undefined
          };

          return new Promise<google.maps.places.PlaceResult[]>((resolve) => {
            service.nearbySearch(request, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                resolve(results);
              } else {
                resolve([]);
              }
            });
          });
        });

        const results = await Promise.all(requests);
        const allResults = results.flat();
        
        // Create an object to store unique results
        const uniqueResultsObj: Record<string, google.maps.places.PlaceResult> = {};
        allResults.forEach(item => {
          if (item.place_id) {
            uniqueResultsObj[item.place_id] = item;
          }
        });
        
        const uniqueResults = Object.values(uniqueResultsObj);
        setAttractions(uniqueResults);

        // Create markers with custom styling
        const newMarkers = uniqueResults.map(place => {
          if (place.geometry?.location) {
            const marker = new google.maps.Marker({
              map,
              position: place.geometry.location,
              title: place.name,
              animation: google.maps.Animation.DROP,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4F46E5',
                fillOpacity: 0.7,
                strokeWeight: 2,
                strokeColor: '#ffffff'
              }
            });

            marker.addListener('click', () => {
              handleAttractionClick(place);
            });

            return marker;
          }
          return null;
        }).filter((marker): marker is google.maps.Marker => marker !== null);
        
        setMarkers(newMarkers);

        // Sort and set recommendations
        const sortedByRating = uniqueResults
          .slice()
          .sort((a, b) => ((b.rating || 0) - (a.rating || 0)));

        setRecommendations({
          mustSee: sortedByRating.slice(0, 3),
          popular: sortedByRating
            .filter(place => (place.user_ratings_total || 0) > 100)
            .slice(0, 3)
        });
      } catch (error) {
        console.error('Error loading attractions:', error);
      }
    };

    loadAttractions();

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, attractionType]); // Only run when map or attractionType changes

  const sortAttractions = (attractions: google.maps.places.PlaceResult[]) => {
    return [...attractions].sort((a, b) => {
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

  const handleAttractionClick = (attraction: google.maps.places.PlaceResult) => {
    if (!map || !attraction.geometry?.location) return;

    map.panTo(attraction.geometry.location);
    map.setZoom(16);
    setSelectedAttraction(attraction);
  };

  const toggleAttractionSelection = (placeId: string | undefined) => {
    if (!placeId) return;
    
    const newSelected = new Set(selectedAttractions);
    if (newSelected.has(placeId)) {
      newSelected.delete(placeId);
    } else {
      newSelected.add(placeId);
    }
    setSelectedAttractions(newSelected);
  };

  const handleFinishPlanning = () => {
    // Clear map and markers before navigation
    markers.forEach(marker => {
      if (marker) marker.setMap(null);
    });
    setMarkers([]);
    if (map) {
      const mapDiv = mapRef.current;
      if (mapDiv) {
        mapDiv.innerHTML = '';
      }
      setMap(null);
    }
    
    const selectedPlaces = attractions.filter(a => a.place_id && selectedAttractions.has(a.place_id));
    localStorage.setItem('selectedAttractions', JSON.stringify(selectedPlaces));
    updateNavigationState('itinerary');
    navigate('/itinerary');
  };

  // Save bookmarks to localStorage
  const toggleBookmark = (item: BookmarkedItem) => {
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

  const renderAttractionCard = (attraction: google.maps.places.PlaceResult, index: number) => (
    <motion.div
      key={attraction.place_id || index}
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300 group relative"
      onClick={() => handleAttractionClick(attraction)}
    >
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Bookmark Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            if (attraction.place_id) {
              toggleBookmark({
                id: attraction.place_id,
                type: 'attraction',
                name: attraction.name || '',
                image: attraction.photos?.[0]?.getUrl(),
                details: attraction.vicinity
              });
            }
          }}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
        >
          <FaHeart className={`w-5 h-5 ${
            attraction.place_id && bookmarkedItems.has(attraction.place_id)
              ? 'text-red-500'
              : 'text-gray-400'
          }`} />
        </motion.button>

        {/* Checkbox for selecting attraction */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleAttractionSelection(attraction.place_id);
          }}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md cursor-pointer"
        >
          <input
            type="checkbox"
            checked={attraction.place_id ? selectedAttractions.has(attraction.place_id) : false}
            onChange={(e) => {
              e.stopPropagation();
              toggleAttractionSelection(attraction.place_id);
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          />
        </motion.div>
      </div>

      <div className="flex gap-4">
        {attraction.photos?.[0] ? (
          <img
            src={attraction.photos[0].getUrl()}
            alt={attraction.name}
            className="w-32 h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
          />
        ) : (
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <FaLandmark className="w-8 h-8 text-indigo-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-800 truncate">{attraction.name}</h3>
          <div className="flex items-center my-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`${
                  i < (attraction.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                } w-4 h-4`}
              />
            ))}
            <span className="ml-2 text-gray-600 text-sm">
              {attraction.rating} ({attraction.user_ratings_total} reviews)
            </span>
          </div>
          {attraction.vicinity && (
            <p className="text-gray-600 text-sm truncate">{attraction.vicinity}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton to="/accommodations" />
      
      <motion.div 
        className="bg-white p-6 shadow-lg sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Discover Local Attractions
              </h1>
              <p className="text-gray-600 text-lg">
                Explore the best places to visit
              </p>
            </div>
            <motion.div 
              className="flex flex-wrap gap-3" 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {Object.entries(PLACE_TYPES).map(([type, { label, icon }]) => (
                <motion.button
                  key={type}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAttractionType(type as AttractionType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ease-in-out min-w-[140px] justify-center
                    ${attractionType === type || attractionType === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600'}`}
                >
                  {icon}
                  <span>{label}</span>
                </motion.button>
              ))}
            </motion.div>
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

          {/* Attractions List */}
          <motion.div 
            className="lg:w-2/5 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Recommendations Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Must-See Places
              </h2>
              <div className="grid gap-4">
                {recommendations.mustSee.map((place, index) => (
                  <motion.div
                    key={place.place_id || index}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleAttractionClick(place)}
                  >
                    <h3 className="text-xl font-bold mb-2">{place.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-300">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < (place.rating || 0) ? 'text-yellow-300' : 'text-white/30'}
                          />
                        ))}
                      </div>
                      <span className="ml-2">
                        {place.rating} ({place.user_ratings_total} reviews)
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* All Attractions */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                All Attractions
              </h2>
              <AnimatePresence>
                {sortAttractions(attractions).map((attraction, index) => renderAttractionCard(attraction, index))}
              </AnimatePresence>
            </motion.div>
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
          onClick={handleFinishPlanning}
          className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-300
            ${selectedAttractions.size > 0
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
              : 'bg-gray-300 cursor-not-allowed text-gray-600'}`}
          disabled={selectedAttractions.size === 0}
        >
          Continue to Itinerary
          <FaArrowRight />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Map; 