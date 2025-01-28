import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flight } from '../../types';

interface FlightListProps {
  flights: Flight[];
}

const FlightList: React.FC<FlightListProps> = ({ flights }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flights.map((flight) => (
        <div 
          key={flight.id} 
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/flights/${flight.id}`)}
        >
          <h3 className="text-xl font-semibold mb-2">{flight.airline}</h3>
          <div className="flex justify-between mb-2">
            <span>{flight.departure.time}</span>
            <span>{flight.arrival.time}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">${flight.price.amount}</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Select
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlightList; 