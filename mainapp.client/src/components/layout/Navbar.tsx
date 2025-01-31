import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaPlaneDeparture, FaHotel, FaMapMarkedAlt, FaRoute, FaUser, FaChevronRight } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  // Function to determine if a path should be colored based on current progress
  const isColored = (path: string): boolean => {
    const currentPath = location.pathname;
    const paths = ['/flights', '/accommodations', '/map', '/itinerary'];
    const currentIndex = paths.indexOf(currentPath);
    const pathIndex = paths.indexOf(path);
    
    return pathIndex <= currentIndex && currentIndex !== -1;
  };

  const mainNavItems = [
    { path: '/flights', label: 'Flights', icon: <FaPlaneDeparture className="w-5 h-5" /> },
    { path: '/accommodations', label: 'Accommodations', icon: <FaHotel className="w-5 h-5" /> },
    { path: '/map', label: 'Map', icon: <FaMapMarkedAlt className="w-5 h-5" /> },
    { path: '/itinerary', label: 'Itinerary', icon: <FaRoute className="w-5 h-5" /> },
  ];

  return (
    <motion.nav 
      className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-white/90"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Home */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
            >
              <FaHome className="w-6 h-6" />
            </Link>
          </div>

          {/* Main Navigation Progress */}
          <div className="flex items-center justify-center flex-1 space-x-1">
            {mainNavItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const colored = isColored(item.path);
              
              return (
                <React.Fragment key={item.path}>
                  <div className="relative">
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group
                      ${isActive ? 'text-blue-600' : colored ? 'text-blue-600' : 'text-gray-400'}
                    `}>
                      <div className="flex flex-col items-center gap-1">
                        {item.icon}
                        <span>{item.label}</span>
                        {(isActive || colored) && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                            layoutId="navbar-indicator"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {index < mainNavItems.length - 1 && (
                    <div className={`flex items-center ${colored ? 'text-blue-600' : 'text-gray-400'}`}>
                      <FaChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Profile */}
          <div className="flex items-center">
            <Link
              to="/profile"
              className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
            >
              <FaUser className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 