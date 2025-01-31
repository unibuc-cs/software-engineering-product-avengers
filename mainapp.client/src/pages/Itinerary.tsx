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

interface ItineraryRequest {
  startDate: string;
  endDate: string;
  dayPlans: {
    date: string;
    activities: {
      id: string;
      name: string;
      startTime: string;
      duration: number;
      type: string;
    }[];
  }[];
}

const TimeSlotInfo: React.FC<{ selectedDay: number; flightTimes: { arrival: Date; departure: Date } }> = ({ 
  selectedDay, 
  flightTimes 
}) => {
  const isFirstDay = selectedDay === 0;
  const lastDay = Math.floor((flightTimes.departure.getTime() - flightTimes.arrival.getTime()) / (1000 * 60 * 60 * 24));
  const isLastDay = selectedDay === lastDay;

  if (!isFirstDay && !isLastDay) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FaClock className="text-blue-600 w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-blue-800">Time Restrictions for {isFirstDay ? 'Arrival' : 'Departure'} Day</h3>
          <p className="text-blue-600 mt-1">
            {isFirstDay ? (
              <>
                Your flight arrives at {flightTimes.arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                Activities can only be scheduled after arrival.
              </>
            ) : (
              <>
                Your flight departs at {flightTimes.departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                Activities can only be scheduled before departure.
              </>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Itinerary: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [flightTimes, setFlightTimes] = useState<{
    arrival: Date;
    departure: Date;
  }>({ arrival: new Date(), departure: new Date() });

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

  const isTimeSlotAvailable = (timeSlot: string, dayIndex: number, flightTimes: {
    arrival: Date;
    departure: Date;
  }) => {
    const currentDate = new Date(flightTimes.arrival);
    currentDate.setDate(currentDate.getDate() + dayIndex);
    
    const [hours] = timeSlot.split(':').map(Number);
    const slotDate = new Date(currentDate);
    slotDate.setHours(hours, 0, 0, 0);

    // For first day, check if time slot is after arrival
    if (dayIndex === 0) {
      const arrivalHour = flightTimes.arrival.getHours();
      if (hours < arrivalHour) return false;
    }

    // For last day, check if time slot is before departure
    const lastDay = Math.floor((flightTimes.departure.getTime() - flightTimes.arrival.getTime()) / (1000 * 60 * 60 * 24));
    if (dayIndex === lastDay) {
      const departureHour = flightTimes.departure.getHours();
      if (hours >= departureHour) return false;
    }

    return true;
  };

  useEffect(() => {
    // Get all stored data
    const flightData = JSON.parse(localStorage.getItem('selectedFlight') || '{}');
    const accommodationData = JSON.parse(localStorage.getItem('selectedAccommodation') || '{}');
    const attractionsData = JSON.parse(localStorage.getItem('selectedAttractions') || '[]');
    
    // Get arrival and departure times
    const arrivalTime = new Date(flightData.flight?.itineraries[0]?.segments[0]?.arrivalTime);
    const departureTime = new Date(flightData.flight?.itineraries[1]?.segments[0]?.departureTime);
    
    // Calculate trip duration from flight data
    const tripDays = Math.ceil((departureTime.getTime() - arrivalTime.getTime()) / (1000 * 60 * 60 * 24));
    
    // Initialize day plans
    const initialDayPlans: DayPlan[] = [];
    for (let i = 0; i < tripDays; i++) {
      const date = new Date(arrivalTime);
      date.setDate(date.getDate() + i);
      
      const activities: DayPlan['activities'] = [];

      // Add flight for first day
      if (i === 0) {
        activities.push({
          id: 'arrival-flight',
          name: 'Arrival Flight',
          startTime: arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: flightData.flight?.itineraries[0]?.segments[0]?.duration || 0,
          type: 'flight'
        });
      }
      // Add hotel wake up time for middle days
      else if (i < tripDays - 1) {
        activities.push({
          id: 'hotel-morning',
          name: 'Start from Hotel',
          startTime: '08:00',
          duration: 0,
          type: 'hotel'
        });
      }
      // Add departure flight for last day
      else {
        activities.push({
          id: 'departure-flight',
          name: 'Departure Flight',
          startTime: departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

    // Store flight times for time slot validation
    setFlightTimes({ arrival: arrivalTime, departure: departureTime });

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

  const handleFinishPlanning = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Get stored data
      const flightData = JSON.parse(localStorage.getItem('selectedFlight') || '{}');
      const accommodationData = JSON.parse(localStorage.getItem('selectedAccommodation') || '{}');
      
      // Format the itinerary data
      const itineraryData: ItineraryRequest = {
        startDate: new Date(flightData.flight?.itineraries[0]?.segments[0]?.departureTime).toISOString(),
        endDate: new Date(flightData.flight?.itineraries[1]?.segments[0]?.departureTime).toISOString(),
        dayPlans: dayPlans.map(day => ({
          date: day.date.toISOString(),
          activities: day.activities.map(activity => ({
            id: activity.id,
            name: activity.name,
            startTime: activity.startTime,
            duration: activity.duration,
            type: activity.type
          }))
        }))
      };

      // Get the auth token from localStorage or your auth state
      const token = localStorage.getItem('token'); // Or from your auth state
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Save the itinerary
      const response = await fetch('https://localhost:5193/api/Itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itineraryData)
      });

      if (!response.ok) {
        throw new Error('Failed to save itinerary');
      }

      // Show success message and redirect to profile
      navigate('/profile', { 
        state: { 
          message: 'Trip itinerary saved successfully!' 
        } 
      });

    } catch (error) {
      console.error('Error saving itinerary:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save itinerary');
    } finally {
      setIsSaving(false);
    }
  };

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
            <TimeSlotInfo selectedDay={selectedDay} flightTimes={flightTimes} />
            
            <div className="space-y-4">
              {timeSlots.map((timeSlot) => {
                const activity = dayPlans[selectedDay]?.activities.find(
                  a => a.startTime === timeSlot
                );
                const isAvailable = isTimeSlotAvailable(timeSlot, selectedDay, flightTimes);

                // Add hover title to explain why slot is unavailable
                const getTimeSlotTitle = () => {
                  if (!isAvailable) {
                    if (selectedDay === 0) {
                      return `This time slot is before your flight arrival at ${flightTimes.arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    }
                    const lastDay = Math.floor((flightTimes.departure.getTime() - flightTimes.arrival.getTime()) / (1000 * 60 * 60 * 24));
                    if (selectedDay === lastDay) {
                      return `This time slot is after your flight departure at ${flightTimes.departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    }
                  }
                  return '';
                };

                return (
                  <motion.div
                    key={timeSlot}
                    variants={itemVariants}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200
                      ${activity ? 'bg-blue-50 border border-blue-200' : 
                        isAvailable ? 'hover:bg-gray-50 border border-transparent' : 'bg-gray-100 opacity-50 cursor-not-allowed'}
                      ${selectedTimeSlot === timeSlot ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => {
                      if (isAvailable && !activity) {
                        setSelectedTimeSlot(timeSlot);
                        setShowActivityModal(true);
                      }
                    }}
                    title={getTimeSlotTitle()}
                  >
                    <div className={`w-20 font-medium ${isAvailable ? 'text-gray-600' : 'text-gray-400'}`}>
                      {timeSlot}
                      {!isAvailable && (
                        <div className="text-xs text-red-400 mt-1">Unavailable</div>
                      )}
                    </div>
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

      <motion.button
        onClick={handleFinishPlanning}
        disabled={isSaving}
        className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-10
          ${isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
      >
        {isSaving ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
        ) : (
          <>
            Save Trip
            <FaArrowRight />
          </>
        )}
      </motion.button>

      {saveError && (
        <div className="fixed bottom-20 right-6 p-4 bg-red-100 text-red-600 rounded-lg shadow-lg">
          {saveError}
        </div>
      )}
    </motion.div>
  );
};

export default Itinerary; 