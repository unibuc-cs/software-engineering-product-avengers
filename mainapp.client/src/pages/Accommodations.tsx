import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaWifi, FaSwimmingPool, FaDumbbell, FaUtensils } from 'react-icons/fa';
import { Accommodation } from '../types';
import { useAppDispatch } from '../hooks/redux';

interface FilterState {
  priceRange: string;
  type: string;
  rating: string;
  city: string;
}

const Accommodations: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [filters, setFilters] = useState<FilterState>({
    priceRange: '',
    type: '',
    rating: '',
    city: ''
  });

  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // TODO: Implement API call with filters
  };

  const handleAccommodationClick = (id: string) => {
    navigate(`/accommodations/${id}`);
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Stay</h1>
      
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-lg mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            name="priceRange"
            className="input-field"
            value={filters.priceRange}
            onChange={handleFilterChange}
          >
            <option value="">Price Range</option>
            <option value="budget">Budget (Under $100)</option>
            <option value="moderate">Moderate ($100 - $200)</option>
            <option value="luxury">Luxury ($200+)</option>
          </select>

          <select
            name="type"
            className="input-field"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">Accommodation Type</option>
            <option value="hotel">Hotel</option>
            <option value="apartment">Apartment</option>
            <option value="resort">Resort</option>
          </select>

          <select
            name="rating"
            className="input-field"
            value={filters.rating}
            onChange={handleFilterChange}
          >
            <option value="">Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>

          <input
            type="text"
            name="city"
            placeholder="Enter City"
            className="input-field"
            value={filters.city}
            onChange={handleFilterChange}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodations.map((accommodation, index) => (
          <motion.div
            key={accommodation.id}
            className="card overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-transform duration-300"
            onClick={() => handleAccommodationClick(accommodation.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative h-48">
              <img 
                src={accommodation.images[0]}
                alt={accommodation.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                <span className="text-yellow-400 flex items-center">
                  <FaStar className="mr-1" />
                  {accommodation.rating}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{accommodation.name}</h3>
              <p className="text-gray-600 mb-4">{accommodation.address}</p>
              
              <div className="flex space-x-4 mb-4">
                {accommodation.amenities.includes('wifi') && <FaWifi className="text-blue-600" />}
                {accommodation.amenities.includes('pool') && <FaSwimmingPool className="text-blue-600" />}
                {accommodation.amenities.includes('gym') && <FaDumbbell className="text-blue-600" />}
                {accommodation.amenities.includes('restaurant') && <FaUtensils className="text-blue-600" />}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ${accommodation.price.amount}/{accommodation.price.per}
                </span>
                <button className="btn-secondary">View Details</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Accommodations; 