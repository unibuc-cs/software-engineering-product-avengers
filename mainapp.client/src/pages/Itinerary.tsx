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

interface TripRequest {
  flightDetails: {
    itineraries: Array<{
      segments: Array<{
        departureAirport: string;
        departureTime: string;
        arrivalAirport: string;
        arrivalTime: string;
        carrierCode: string;
        flightNumber: string;
        duration: string;
      }>;
    }>;
    price: {
      currency: string;
      total: string;
      base: string;
    };
  };
  hotelDetails: {
    placeId: string;
    address: string;
    name: string;
    rating: number;
    totalUserRating: number;
    location: {
      latitude: number;
      longitude: number;
    };
    price: number;
    photos: string[];
  };
  itinerary: {
    name: string;
    startDate: string;
    endDate: string;
    dayPlans: Array<{
      dayPlanId: number;
      date: string;
      activities: Array<{
        id: number;
        activityId: number;
        name: string;
        startTime: string;
        duration: number;
        type: string;
      }>;
    }>;
  };
  tripDates: {
    startDate: string;
    endDate: string;
  };
  tripName: string;
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
      const flightData = JSON.parse(localStorage.getItem('selectedFlight') || '{}');
      const hotelData = JSON.parse(localStorage.getItem('selectedAccommodation') || '{}');
      const activitiesData = JSON.parse(localStorage.getItem('selectedAttractions') || '[]');

      // Check if we have all required data
      if (!flightData?.flight?.itineraries) {
        throw new Error('Flight itineraries missing');
      }

      const tripRequest: TripRequest = {
        flightDetails: {
          itineraries: flightData.flight.itineraries,
          price: flightData.flight.price || {
            currency: 'USD',
            total: '0',
            base: '0'
          }
        },
        hotelDetails: {
          placeId: hotelData.placeId || '',
          address: hotelData.address || '',
          name: hotelData.name || '',
          rating: hotelData.rating || 0,
          totalUserRating: hotelData.totalUserRating || 0,
          location: {
            latitude: hotelData.location?.latitude || 0,
            longitude: hotelData.location?.longitude || 0
          },
          price: hotelData.price || 0,
          photos: hotelData.photos || []
        },
        itinerary: {
          name: `Trip to ${hotelData.name}`,
          startDate: flightData.flight.itineraries[0].segments[0].departureTime,
          endDate: flightData.flight.itineraries[1].segments[0].arrivalTime,
          dayPlans: dayPlans.map((day, index) => ({
            dayPlanId: index + 1,
            date: day.date.toISOString().split('T')[0],
            activities: day.activities.map((activity, actIndex) => ({
              id: parseInt(activity.id),
              activityId: parseInt(activity.id) * 2,
              name: activity.name,
              startTime: activity.startTime,
              duration: parseInt(activity.duration.toString()),
              type: activity.type
            }))
          })),
        },
        tripDates: {
          startDate: flightData.flight.itineraries[0].segments[0].departureTime,
          endDate: flightData.flight.itineraries[1].segments[0].arrivalTime
        },
        tripName: `Trip to ${hotelData.name}`
      };

      const response = await fetch('https://localhost:5193/api/Reservation/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(tripRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to save trip');
      }

      // Clear localStorage
      localStorage.removeItem('selectedFlight');
      localStorage.removeItem('selectedAccommodation');
      localStorage.removeItem('selectedAttractions');

      navigate('/profile');
    } catch (error) {
      setSaveError((error as Error).message);
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
        className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-2
          ${isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isSaving ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
        ) : (
          'Save Trip'
        )}
      </motion.button>

      {saveError && (
        <div className="text-red-500 mt-2">
          Error saving trip: {saveError}
        </div>
      )}
    </motion.div>
  );
};

export default Itinerary; 