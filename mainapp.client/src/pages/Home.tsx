import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlaneDeparture, FaHotel, FaMapMarkedAlt, FaRoute } from 'react-icons/fa';
import { useAppSelector } from '../hooks/redux';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector(state => state.user);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const steps = [
    { step: 1, title: 'Book Flight', desc: 'Choose your destination', icon: <FaPlaneDeparture className="w-6 h-6" /> },
    { step: 2, title: 'Find Hotel', desc: 'Select perfect accommodation', icon: <FaHotel className="w-6 h-6" /> },
    { step: 3, title: 'Plan Activities', desc: 'Discover local attractions', icon: <FaMapMarkedAlt className="w-6 h-6" /> },
    { step: 4, title: 'View Itinerary', desc: 'Review your journey', icon: <FaRoute className="w-6 h-6" /> }
  ];

  const handleStartAdventure = () => {
    if (currentUser) {
      navigate('/flights');
    } else {
      navigate('/profile');
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          className="text-center mb-16 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Your Journey Begins Here
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Plan your perfect journey with our intelligent travel companion. From flights to activities, we've got you covered.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartAdventure}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl text-xl font-semibold transition-all duration-300 shadow-lg hover:from-blue-700 hover:to-indigo-700"
            >
              <FaPlaneDeparture className="inline-block mr-3 mb-1" />
              Start Your Adventure
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((item) => (
            <motion.div
              key={item.step}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Destinations Section */}
        <motion.div 
          className="mt-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Popular Destinations
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80', desc: 'The City of Light' },
              { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=500&q=80', desc: 'Where Tradition Meets Future' },
              { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&q=80', desc: 'The City That Never Sleeps' },
            ].map((destination, index) => (
              <motion.div
                key={destination.name}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                  <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                  <p className="text-gray-200">{destination.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home; 