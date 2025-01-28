import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { removeActivity } from '../store/slices/itinerarySlice';

const Itinerary: React.FC = () => {
  const dispatch = useAppDispatch();
  const itinerary = useAppSelector((state) => state.itinerary);

  const handleRemoveActivity = (id: string) => {
    dispatch(removeActivity(id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Itinerary</h1>
      
      <div className="space-y-6">
        {/* Flight Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Flight</h2>
          {itinerary.flight ? (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{itinerary.flight.airline}</p>
                <p className="text-gray-600">
                  {itinerary.flight.departure.city} → {itinerary.flight.arrival.city}
                </p>
              </div>
              <button className="text-red-500 hover:text-red-700">Remove</button>
            </div>
          ) : (
            <p className="text-gray-500">No flight selected</p>
          )}
        </div>

        {/* Rest of the component remains the same, just with proper typing */}
      </div>
    </div>
  );
};

export default Itinerary; 