import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Flight {
  id: string;
  from: string;
  to: string;
  price: number;
  departure: string;
  arrival: string;
}

const Flights = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    destination: '',
    price: '',
    date: '',
  });

  // Placeholder for flight data
  const [flights] = useState<Flight[]>([
    {
      id: '1',
      from: 'New York',
      to: 'Paris',
      price: 499,
      departure: '2024-04-01T10:00:00',
      arrival: '2024-04-01T22:00:00',
    },
    // Add more mock data as needed
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Find Flights</h1>
      
      <form onSubmit={handleSearch} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Destination"
            className="border p-2 rounded"
            value={searchParams.destination}
            onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="border p-2 rounded"
            value={searchParams.price}
            onChange={(e) => setSearchParams({...searchParams, price: e.target.value})}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={searchParams.date}
            onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search Flights
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/flights/${flight.id}`)}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">{flight.from} → {flight.to}</span>
              <span className="text-green-600 font-bold">${flight.price}</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Departure: {new Date(flight.departure).toLocaleString()}</p>
              <p>Arrival: {new Date(flight.arrival).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flights;