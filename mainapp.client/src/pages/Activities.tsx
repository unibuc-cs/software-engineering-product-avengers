import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaStar, FaHotel, FaUtensils, FaLandmark, FaTheaterMasks } from 'react-icons/fa';
import { updateNavigationState, canAccess } from '../utils/navigationState';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA81yc5Jf_TmZNIfBR2yNIjb9dJqV3umvk';

type AttractionType = 'all' | 'restaurant' | 'museum' | 'tourist_attraction' | 'park';
type SortOption = 'rating' | 'reviews' | 'name';

const Activities: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [attractions, setAttractions] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedAttraction, setSelectedAttraction] = useState<google.maps.places.PlaceResult | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [attractionType, setAttractionType] = useState<AttractionType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [selectedAttractions, setSelectedAttractions] = useState<Set<string>>(new Set());

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
  }, [navigate]);

  useEffect(() => {
    // Load previously selected attractions from localStorage
    const savedAttractions = localStorage.getItem('selectedAttractions');
    if (savedAttractions) {
      const parsed = JSON.parse(savedAttractions);
      const selectedIds = new Set<string>(
        parsed.map((place: google.maps.places.PlaceResult) => place.place_id as string)
          .filter((id: string | undefined): id is string => id !== undefined)
      );
      setSelectedAttractions(selectedIds);
    }
  }, []);

  const loadAttractions = async (map: google.maps.Map, location: google.maps.LatLng) => {
    const service = new google.maps.places.PlacesService(map);
    const types = attractionType === 'all' 
      ? ['restaurant', 'museum', 'tourist_attraction', 'park']
      : [attractionType];

    const requests = types.map(type => {
      return new Promise<google.maps.places.PlaceResult[]>((resolve) => {
        const request = {
          location: location,
          radius: 5000,
          type: type,
          rankBy: google.maps.places.RankBy.PROMINENCE
        } as google.maps.places.PlaceSearchRequest;

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            resolve([]);
          }
        });
      });
    });

    const allResults = await Promise.all(requests);
    const combinedResults = allResults.flat();
    
    // Remove duplicates and sort
    const uniqueResults = Array.from(new Map(combinedResults.map(item => 
      [item.place_id, item])).values());
    
    setAttractions(sortAttractions(uniqueResults));
    await createMarkers(uniqueResults, map);
  };

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const hotelData = JSON.parse(localStorage.getItem('selectedAccommodation') || '{}');
        if (!hotelData.geometry?.location) return;

        const location = new google.maps.LatLng(
          hotelData.geometry.location.lat,
          hotelData.geometry.location.lng
        );

        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
          script.async = true;
          
          window.initMap = () => {
            if (mapRef.current) {
              const newMap = new google.maps.Map(mapRef.current, {
                center: location,
                zoom: 14,
                mapId: 'DEMO_MAP_ID'
              });
              setMap(newMap);
              loadAttractions(newMap, location);
            }
            resolve();
          };

          document.head.appendChild(script);
        });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    loadGoogleMaps();

    return () => {
      markers.forEach(marker => {
        if (marker instanceof google.maps.Marker) {
          marker.setMap(null);
        }
      });
    };
  }, [attractionType]);

  const createMarkers = async (places: google.maps.places.PlaceResult[], map: google.maps.Map) => {
    markers.forEach(marker => {
      if (marker instanceof google.maps.Marker) {
        marker.setMap(null);
      }
    });
    
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const newMarkers = places.map(place => {
      if (place.geometry?.location) {
        const marker = new AdvancedMarkerElement({
          map,
          position: place.geometry.location,
          title: place.name
        });
        
        marker.addListener('click', () => handleAttractionClick(place));
        return marker;
      }
      return null;
    }).filter(Boolean) as google.maps.marker.AdvancedMarkerElement[];
    
    setMarkers(newMarkers);
  };

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
    // Load all attractions for all categories
    const service = new google.maps.places.PlacesService(map!);
    const hotelData = JSON.parse(localStorage.getItem('selectedAccommodation') || '{}');
    const location = new google.maps.LatLng(
      hotelData.geometry.location.lat,
      hotelData.geometry.location.lng
    );

    // Define all types we want to search for
    const allTypes = ['restaurant', 'museum', 'tourist_attraction', 'park'];
    
    Promise.all(allTypes.map(type => {
      return new Promise<google.maps.places.PlaceResult[]>((resolve) => {
        const request = {
          location: location,
          radius: 5000,
          type: type,
          rankBy: google.maps.places.RankBy.PROMINENCE
        } as google.maps.places.PlaceSearchRequest;

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            resolve([]);
          }
        });
      });
    })).then(results => {
      // Flatten all results and filter only selected ones
      const allResults = results.flat();
      const uniqueResults = Array.from(
        new Map(allResults.map(item => [item.place_id, item])).values()
      );
      
      const selectedPlaces = uniqueResults.filter(
        place => place.place_id && selectedAttractions.has(place.place_id)
      );

      localStorage.setItem('selectedAttractions', JSON.stringify(selectedPlaces));
      updateNavigationState('itinerary');
      navigate('/itinerary');
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="bg-white p-4 shadow-md">
        <div className="max-w-[2000px] mx-auto">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Discover Local Attractions
              </h1>
              <p className="text-gray-600">
                Select places you'd like to visit
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={attractionType}
                onChange={(e) => setAttractionType(e.target.value as AttractionType)}
                className="border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Attractions</option>
                <option value="restaurant">Restaurants</option>
                <option value="museum">Museums</option>
                <option value="tourist_attraction">Tourist Spots</option>
                <option value="park">Parks</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Rating</option>
                <option value="reviews">Number of Reviews</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Map Container */}
        <div className="w-full md:w-3/5 p-4" style={{ minHeight: '500px' }}>
          <div ref={mapRef} className="w-full h-full rounded-lg shadow-md" style={{ minHeight: '500px' }} />
        </div>

        {/* Attractions List */}
        <div className="w-full md:w-2/5 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          {sortAttractions(attractions).map((attraction, index) => (
            <div 
              key={attraction.place_id || index}
              className={`bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer transition-all hover:shadow-lg
                ${selectedAttraction?.place_id === attraction.place_id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex gap-4">
                {attraction.photos?.[0] && (
                  <img
                    src={attraction.photos[0].getUrl()}
                    alt={attraction.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{attraction.name}</h3>
                    <input
                      type="checkbox"
                      checked={attraction.place_id ? selectedAttractions.has(attraction.place_id) : false}
                      onChange={() => toggleAttractionSelection(attraction.place_id)}
                      className="w-5 h-5 text-blue-600"
                    />
                  </div>
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
                    <p className="text-gray-600 text-sm">{attraction.vicinity}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleFinishPlanning}
          className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-colors
            ${selectedAttractions.size > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-300 cursor-not-allowed text-gray-600'}`}
          disabled={selectedAttractions.size === 0}
        >
          Continue to Itinerary
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Activities; 