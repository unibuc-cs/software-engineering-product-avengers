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