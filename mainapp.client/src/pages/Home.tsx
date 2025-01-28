import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlaneDeparture, FaHotel, FaMapMarkedAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';

const Home: React.FC = () => {
  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Plan Your Perfect Journey</h1>
        <p className="text-xl text-gray-600">All-in-one travel planning made simple</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg"
          whileHover={{ y: -5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Find Flights</h2>
          <p className="text-gray-600 mb-4">Search and compare flights from multiple airlines</p>
          <Link 
            to="/flights"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Search Flights →
          </Link>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg"
          whileHover={{ y: -5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Book Accommodations</h2>
          <p className="text-gray-600 mb-4">Discover perfect places to stay during your trip</p>
          <Link 
            to="/accommodations"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Find Accommodations →
          </Link>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg"
          whileHover={{ y: -5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Explore Destinations</h2>
          <p className="text-gray-600 mb-4">Find attractions and create your perfect itinerary</p>
          <Link 
            to="/map"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Explore Map →
          </Link>
        </motion.div>
      </div>

      <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Planning?</h2>
        <p className="text-xl mb-6">Create your account to save your itineraries and get personalized recommendations</p>
        <Link
          to="/profile"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </motion.div>
  );
};

export default Home; 