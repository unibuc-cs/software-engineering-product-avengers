import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';

interface DayActivity {
  id: string;
  name: string;
  time: string;
  duration: string;
  location: string;
  type: 'attraction' | 'restaurant' | 'museum' | 'park' | 'accommodation';
}

interface TravelDay {
  date: string;
  activities: DayActivity[];
}

interface Flight {
  airline: string;
  flightNumber: string;
  departure: {
    time: string;
    airport: string;
    terminal: string;
  };
  arrival: {
    time: string;
    airport: string;
    terminal: string;
  };
}

interface Accommodation {
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  amenities: string[];
}

interface Trip {
  destination: string;
  date: string;
  duration: string;
  days: TravelDay[];
  image?: string;
  outboundFlight: Flight;
  returnFlight: Flight;
  accommodation: Accommodation;
}

const TravelHistory: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Default trip data
  const defaultTrip: Trip = {
    destination: 'Paris, France',
    date: '2024-01-15',
    duration: '7 days',
    outboundFlight: {
      airline: 'Air France',
      flightNumber: 'AF1234',
      departure: {
        time: '10:30 AM',
        airport: 'JFK International',
        terminal: 'Terminal 4'
      },
      arrival: {
        time: '11:45 PM',
        airport: 'Charles de Gaulle',
        terminal: 'Terminal 2E'
      }
    },
    returnFlight: {
      airline: 'Air France',
      flightNumber: 'AF1235',
      departure: {
        time: '1:30 PM',
        airport: 'Charles de Gaulle',
        terminal: 'Terminal 2E'
      },
      arrival: {
        time: '3:45 PM',
        airport: 'JFK International',
        terminal: 'Terminal 4'
      }
    },
    accommodation: {
      name: 'Le Grand Paris Hotel',
      address: '1 Rue de Rivoli, 75001 Paris, France',
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      roomType: 'Deluxe Suite with Eiffel Tower View',
      amenities: ['Free Wi-Fi', 'Room Service', 'Spa Access', 'Breakfast Included']
    },
    days: [
      {
        date: '2024-01-15',
        activities: [
          {
            id: '1',
            name: 'Hotel Check-in & Rest',
            time: '3:00 PM',
            duration: '2 hours',
            location: 'Le Grand Paris Hotel',
            type: 'accommodation'
          },
          {
            id: '2',
            name: 'Welcome Dinner at Le Jules Verne',
            time: '7:00 PM',
            duration: '2 hours',
            location: 'Eiffel Tower, 2nd Floor',
            type: 'restaurant'
          }
        ]
      },
      {
        date: '2024-01-16',
        activities: [
          {
            id: '3',
            name: 'Louvre Museum Tour',
            time: '9:00 AM',
            duration: '3 hours',
            location: 'Rue de Rivoli',
            type: 'museum'
          },
          {
            id: '4',
            name: 'Lunch at L\'Ami Louis',
            time: '1:00 PM',
            duration: '1.5 hours',
            location: 'Marais District',
            type: 'restaurant'
          },
          {
            id: '5',
            name: 'Seine River Cruise',
            time: '4:00 PM',
            duration: '1 hour',
            location: 'Port de la Bourdonnais',
            type: 'attraction'
          }
        ]
      }
    ]
  };

  // Use location state if available, otherwise use default trip
  const trip: Trip = location.state?.trip || defaultTrip;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          whileHover={{ x: -2 }}
        >
          <FaArrowLeft />
          Back to Profile
        </motion.button>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {trip.destination}
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <FaCalendar className="text-blue-600" />
              {new Date(trip.date).toLocaleDateString()} • {trip.duration}
            </p>
          </motion.div>

          {/* Flight Details */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Flight Details</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Outbound Flight</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Departure</p>
                    <p className="font-medium">{trip.outboundFlight.departure.time}</p>
                    <p className="text-sm">{trip.outboundFlight.departure.airport}</p>
                    <p className="text-sm text-gray-500">{trip.outboundFlight.departure.terminal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Arrival</p>
                    <p className="font-medium">{trip.outboundFlight.arrival.time}</p>
                    <p className="text-sm">{trip.outboundFlight.arrival.airport}</p>
                    <p className="text-sm text-gray-500">{trip.outboundFlight.arrival.terminal}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {trip.outboundFlight.airline} - Flight {trip.outboundFlight.flightNumber}
                </p>
              </div>

              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Return Flight</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Departure</p>
                    <p className="font-medium">{trip.returnFlight.departure.time}</p>
                    <p className="text-sm">{trip.returnFlight.departure.airport}</p>
                    <p className="text-sm text-gray-500">{trip.returnFlight.departure.terminal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Arrival</p>
                    <p className="font-medium">{trip.returnFlight.arrival.time}</p>
                    <p className="text-sm">{trip.returnFlight.arrival.airport}</p>
                    <p className="text-sm text-gray-500">{trip.returnFlight.arrival.terminal}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {trip.returnFlight.airline} - Flight {trip.returnFlight.flightNumber}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Accommodation Details */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Accommodation</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{trip.accommodation.name}</h3>
              <p className="text-gray-600">{trip.accommodation.address}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Check-in</p>
                  <p className="font-medium">{trip.accommodation.checkIn}</p>
                </div>
                <div>
                  <p className="text-gray-600">Check-out</p>
                  <p className="font-medium">{trip.accommodation.checkOut}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600">Room Type</p>
                <p className="font-medium">{trip.accommodation.roomType}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {trip.accommodation.amenities.map((amenity, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {trip.days?.map((day: TravelDay, index: number) => (
            <motion.div
              key={day.date}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-xl p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Day {index + 1} - {new Date(day.date).toLocaleDateString()}
              </h2>
              <div className="space-y-4">
                {day.activities?.map((activity) => (
                  <motion.div
                    key={activity.id}
                    className="p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all"
                    whileHover={{ x: 4 }}
                  >
                    <h3 className="font-semibold text-lg text-gray-800">
                      {activity.name}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <FaClock className="text-blue-600" />
                        {activity.time} ({activity.duration})
                      </p>
                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-600" />
                        {activity.location}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TravelHistory; 