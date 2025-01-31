import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { removeActivity } from '../store/slices/itinerarySlice';
import { FaHotel, FaMapMarkerAlt, FaPlaneDeparture, FaPlaneArrival, FaClock, FaPlus, FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BackButton from "../components/common/BackButton";

interface Activity {
  id: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'museum' | 'park';
  duration: number; // in minutes
  startTime?: string;
}

interface DayPlan {
  date: Date;
  activities: {
    id: string;
    name: string;
    startTime: string;
    duration: number;
    type: 'attraction' | 'restaurant' | 'museum' | 'park' | 'hotel' | 'flight';
  }[];
}

const Itinerary: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const navigate = useNavigate();

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
    // Get all stored data
    const flightData = JSON.parse(localStorage.getItem('selectedFlight') || '{}');
    const accommodationData = JSON.parse(localStorage.getItem('selectedAccommodation') || '{}');
    const attractionsData = JSON.parse(localStorage.getItem('selectedAttractions') || '[]');
    
    // Calculate trip duration from flight data
    const departureDate = new Date(flightData.flight?.itineraries[0]?.segments[0]?.departureTime);
    const returnDate = new Date(flightData.flight?.itineraries[1]?.segments[0]?.departureTime);
    const tripDays = Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Initialize day plans
    const initialDayPlans: DayPlan[] = [];
    for (let i = 0; i < tripDays; i++) {
      const date = new Date(departureDate);
      date.setDate(date.getDate() + i);
      
      const activities: DayPlan['activities'] = [];
      // Add hotel wake up time for each day except departure
      if (i > 0) {
        activities.push({
          id: 'hotel-morning',
          name: 'Start from Hotel',
          startTime: '08:00',
          duration: 0,
          type: 'hotel'
        });
      }
      
      // Add flight for first and last day
      if (i === 0) {
        activities.push({
          id: 'departure-flight',
          name: 'Departure Flight',
          startTime: new Date(flightData.flight?.itineraries[0]?.segments[0]?.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: flightData.flight?.itineraries[0]?.segments[0]?.duration || 0,
          type: 'flight'
        });
      } else if (i === tripDays - 1) {
        activities.push({
          id: 'return-flight',
          name: 'Return Flight',
          startTime: new Date(flightData.flight?.itineraries[1]?.segments[0]?.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: flightData.flight?.itineraries[1]?.segments[0]?.duration || 0,
          type: 'flight'
        });
      }
      
      initialDayPlans.push({
        date,
        activities
      });
    }
    setDayPlans(initialDayPlans);

    // Set available activities from selected attractions
    const activities: Activity[] = attractionsData.map((attraction: any) => ({
      id: attraction.place_id,
      name: attraction.name,
      type: (attraction.types?.[0] || 'attraction') as Activity['type'],
      duration: 120 // Default 2 hours per activity
    }));
    setAvailableActivities(activities);
  }, []);

  const handleAddActivity = (activity: Activity, timeSlot: string) => {
    const updatedDayPlans = [...dayPlans];
    const currentDayPlan = updatedDayPlans[selectedDay];
    
    currentDayPlan.activities.push({
      ...activity,
      startTime: timeSlot
    });
    
    // Sort activities by time
    currentDayPlan.activities.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
    
    setDayPlans(updatedDayPlans);
    setShowActivityModal(false);
  };

  const handleRemoveActivity = (activityId: string) => {
    const updatedDayPlans = [...dayPlans];
    const currentDayPlan = updatedDayPlans[selectedDay];
    currentDayPlan.activities = currentDayPlan.activities.filter(
      activity => activity.id !== activityId
    );
    setDayPlans(updatedDayPlans);
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton to="/map" />
      
      <motion.div 
        className="bg-white p-6 shadow-lg sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Plan Your Journey
              </h1>
              <p className="text-gray-600">
                Organize your activities day by day
              </p>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectedDay > 0 && setSelectedDay(selectedDay - 1)}
                disabled={selectedDay === 0}
                className={`p-2 rounded-lg ${selectedDay === 0 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <FaArrowLeft />
              </motion.button>
              <span className="font-medium">
                Day {selectedDay + 1} of {dayPlans.length}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectedDay < dayPlans.length - 1 && setSelectedDay(selectedDay + 1)}
                disabled={selectedDay === dayPlans.length - 1}
                className={`p-2 rounded-lg ${selectedDay === dayPlans.length - 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <FaArrowRight />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Timeline */}
          <motion.div 
            className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-4">
              {timeSlots.map((timeSlot) => {
                const activity = dayPlans[selectedDay]?.activities.find(
                  a => a.startTime === timeSlot
                );

                return (
                  <motion.div
                    key={timeSlot}
                    variants={itemVariants}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200
                      ${activity ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}
                      ${selectedTimeSlot === timeSlot ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => {
                      setSelectedTimeSlot(timeSlot);
                      !activity && setShowActivityModal(true);
                    }}
                  >
                    <div className="w-20 font-medium text-gray-600">{timeSlot}</div>
                    {activity ? (
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {activity.type === 'hotel' && <FaHotel className="text-blue-600" />}
                          {activity.type === 'flight' && <FaPlaneDeparture className="text-blue-600" />}
                          {activity.type === 'attraction' && <FaMapMarkerAlt className="text-blue-600" />}
                          <div>
                            <h3 className="font-medium">{activity.name}</h3>
                            <p className="text-sm text-gray-600">
                              Duration: {activity.duration} minutes
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveActivity(activity.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center gap-2 text-gray-400 cursor-pointer group">
                        <FaPlus className="group-hover:text-blue-600" />
                        <span className="group-hover:text-blue-600">Add activity</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Available Activities */}
          <motion.div 
            className="lg:col-span-1 space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Available Activities
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-4 space-y-3">
              {availableActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (selectedTimeSlot) {
                      handleAddActivity(activity, selectedTimeSlot);
                    }
                  }}
                >
                  <h3 className="font-medium">{activity.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaClock />
                    {activity.duration} minutes
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Itinerary; 