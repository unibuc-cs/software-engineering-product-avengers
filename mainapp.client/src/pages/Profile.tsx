import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../store/slices/userSlice';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaHeart, FaHistory, FaSignOutAlt, FaMapMarkedAlt, FaHotel, FaPlaneDeparture, FaClock, FaCalendar, FaStar } from 'react-icons/fa';
import { fetchUserProfile } from '../api';

interface Activity {
  Name: string;
  StartTime: string;
  Duration: number;
  Type: string;
}

interface DayPlan {
  Date: string;
  activities: Activity[];
}

interface Itinerary {
  StartDate: string;
  EndDate: string;
  DayPlans: DayPlan[];
}

interface UserHousing {
  Rating: number;
  Name: string;
  Address: string;
  OpeningHours: string;
  Price: number;
}

interface Flight {
  DepartureAirport: string;
  Destination: string;
}

interface Ticket {
  TotalPrice: number;
  flights: Flight[];
}

interface UserProfile {
  FullName: string;
  Email: string;
  Itineraries: Itinerary[];
  UserHousings: UserHousing[];
  Tickets: Ticket[];
}

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.user);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUserProfile(data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // Redirect to the Login page
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Redirect to the Sign Up page
  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  // If user is not authenticated
  if (!user) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
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
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <FaUser className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {userProfile?.FullName}
              </h1>
              <p className="text-gray-600">{userProfile?.Email}</p>
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
          {/* Travel History Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaHistory className="text-blue-500" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Travel History
              </span>
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              {userProfile?.Itineraries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No travel history yet</p>
              ) : (
                userProfile?.Itineraries.map((itinerary, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-blue-500" />
                          <span className="font-semibold">
                            {new Date(itinerary.StartDate).toLocaleDateString()} - {new Date(itinerary.EndDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {itinerary.DayPlans.map((day, dayIndex) => (
                        <div key={dayIndex} className="bg-white rounded-lg p-4 space-y-3">
                          <h4 className="font-semibold text-gray-700">
                            {new Date(day.Date).toLocaleDateString()}
                          </h4>
                          <div className="space-y-2">
                            {day.activities.map((activity, actIndex) => (
                              <div key={actIndex} className="flex items-center gap-3 text-sm">
                                <FaClock className="text-blue-400" />
                                <span className="font-medium">{activity.StartTime}</span>
                                <span className="text-gray-600">{activity.Name}</span>
                                <span className="text-gray-400">({activity.Duration} min)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Accommodations History */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaHotel className="text-blue-500" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Past Accommodations
              </span>
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
              {userProfile?.UserHousings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No accommodation history yet</p>
              ) : (
                userProfile?.UserHousings.map((housing, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{housing.Name}</h3>
                      <p className="text-sm text-gray-600">{housing.Address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 w-4 h-4" />
                          <span className="ml-1 text-sm">{housing.Rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">${housing.Price}/night</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Flight History */}
          <motion.div variants={itemVariants} className="space-y-6 lg:col-span-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaPlaneDeparture className="text-blue-500" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Flight History
              </span>
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
              {userProfile?.Tickets.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No flight history yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProfile?.Tickets.map((ticket, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-50 rounded-xl p-4 space-y-3"
                    >
                      {ticket.flights.map((flight, flightIndex) => (
                        <div key={flightIndex} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaPlaneDeparture className="text-blue-500" />
                            <span>{flight.DepartureAirport}</span>
                            <span>→</span>
                            <span>{flight.Destination}</span>
                          </div>
                        </div>
                      ))}
                      <div className="text-right text-blue-600 font-semibold">
                        ${ticket.TotalPrice}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
