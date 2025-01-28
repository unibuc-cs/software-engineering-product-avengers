import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface SearchParams {
  origin: string;
  destination: string;
  date: Date;
  maxPrice: string;
}

interface FlightSearchProps {
  onSearch: (params: SearchParams) => void;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: '',
    destination: '',
    date: new Date(),
    maxPrice: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Origin City"
            className="input-field"
            value={searchParams.origin}
            onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
          />
          
          <input
            type="text"
            placeholder="Destination City"
            className="input-field"
            value={searchParams.destination}
            onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
          />
          
          <DatePicker
            selected={searchParams.date}
            onChange={(date: Date | null) => date && setSearchParams({...searchParams, date})}
            className="input-field w-full"
            dateFormat="MM/dd/yyyy"
            minDate={new Date()}
          />
          
          <input
            type="number"
            placeholder="Max Price"
            className="input-field"
            value={searchParams.maxPrice}
            onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value})}
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors w-full md:w-auto"
        >
          Search Flights
        </button>
      </form>
    </div>
  );
};

export default FlightSearch; 