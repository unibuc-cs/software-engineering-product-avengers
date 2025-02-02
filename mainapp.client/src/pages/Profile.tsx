import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux'; // Ensure correct path
import { logout } from '../store/slices/userSlice';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Updated import
import { FaUser, FaHeart, FaHistory, FaSignOutAlt, FaMapMarkedAlt, FaHotel, FaPlaneDeparture } from 'react-icons/fa';

interface BookmarkedItem {
  id: string;
  type: 'attraction' | 'hotel' | 'flight';
  name: string;
  image?: string;
  details?: string;
}


interface userProfile {
    email: string;
    fullName: string;
   
}
const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const { currentUser } = useAppSelector(state => state.user);
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedItem[]>([]);
  const [travelHistory, setTravelHistory] = useState<any[]>([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  useEffect(() => {
    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedItems');
    if (savedBookmarks) {
      const bookmarkIds = new Set<string>(JSON.parse(savedBookmarks));
      // TODO: Replace with actual API call to get bookmark details
      const mockBookmarks: BookmarkedItem[] = Array.from(bookmarkIds).map(id => ({
        id: id.toString(),
        type: 'attraction',
        name: 'Sample Attraction',
        details: 'Sample location'
      }));
      setBookmarkedItems(mockBookmarks);
    }

    // TODO: Replace with actual API call to get travel history
    setTravelHistory([
      {
        id: '1',
        destination: 'Paris, France',
        date: '2024-01-15',
        duration: '7 days',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80'
      },
      {
        id: '2',
        destination: 'Tokyo, Japan',
        date: '2023-11-20',
        duration: '10 days',
        image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=500&q=80'
      }
    ]);
  }, []);

  // Redirect to the Login page
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Redirect to the Sign Up page
  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  const removeBookmark = (itemId: string) => {
    const newBookmarks = bookmarkedItems.filter(item => item.id !== itemId);
    setBookmarkedItems(newBookmarks);
    localStorage.setItem('bookmarkedItems', JSON.stringify(newBookmarks.map(item => item.id)));
  };

  // If user is not authenticated
  if (!currentUser) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Join the Journey
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Sign in to access your travel history, save your favorite destinations, and plan your next adventure.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignUpRedirect}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
                >
                  Sign Up
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginRedirect}
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold shadow-lg border border-blue-100"
                >
                  Log In
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // If user is authenticated
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Profile Header */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <FaUser className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              </h1>
              <p className="text-gray-600">{currentUser.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(logout())}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <FaSignOutAlt />
              Log Out
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookmarks Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaHeart className="text-red-500" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Your Bookmarks
              </span>
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
              {bookmarkedItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bookmarks yet</p>
              ) : (
                bookmarkedItems.map(item => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <div className="p-3 rounded-lg bg-blue-100">
                      {item.type === 'attraction' && <FaMapMarkedAlt className="w-6 h-6 text-blue-600" />}
                      {item.type === 'hotel' && <FaHotel className="w-6 h-6 text-blue-600" />}
                      {item.type === 'flight' && <FaPlaneDeparture className="w-6 h-6 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.details}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeBookmark(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaHeart className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Travel History Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaHistory className="text-blue-500" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Travel History
              </span>
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
              {travelHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No travel history yet</p>
              ) : (
                travelHistory.map(trip => (
                  <motion.div
                    key={trip.id}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-xl shadow-md group"
                  >
                    <img 
                      src={trip.image} 
                      alt={trip.destination}
                      className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-xl font-bold text-white">{trip.destination}</h3>
                      <p className="text-gray-200">
                        {new Date(trip.date).toLocaleDateString()} • {trip.duration}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
