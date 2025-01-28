import React, { useEffect, useRef } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { addActivity } from '../store/slices/itinerarySlice';

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });

      // Add places service
      const service = new google.maps.places.PlacesService(map);

      // Handle clicks on the map
      map.addListener('click', (e: google.maps.MouseEvent) => {
        const location = e.latLng;
        
        const request = {
          location: location,
          radius: 500,
          type: ['tourist_attraction']
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            results.forEach(place => {
              if (place.place_id) {
                const marker = new google.maps.Marker({
                  position: place.geometry?.location,
                  map: map,
                  title: place.name
                });

                marker.addListener('click', () => {
                  if (place.name && place.vicinity) {
                    dispatch(addActivity({
                      id: place.place_id!,
                      name: place.name,
                      type: 'attraction',
                      location: {
                        address: place.vicinity,
                        city: '',
                        coordinates: {
                          lat: place.geometry?.location?.lat() || 0,
                          lng: place.geometry?.location?.lng() || 0,
                        }
                      },
                      duration: '2 hours',
                      price: {
                        amount: 0,
                        currency: 'USD'
                      },
                      description: place.name,
                      images: place.photos?.map(photo => photo.getUrl()) || [],
                      rating: place.rating || 0,
                      reviews: place.user_ratings_total || 0
                    }));
                  }
                });
              }
            });
          }
        });
      });
    }
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Destinations</h1>
      <div 
        ref={mapRef} 
        className="w-full h-[600px] rounded-lg shadow-lg"
      />
    </div>
  );
};

export default Map; 