import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlaneDeparture, FaPlaneArrival, FaCalendar, FaUser, FaSearch, FaClock, FaExchangeAlt, FaHeart } from "react-icons/fa";
import { updateNavigationState } from "../utils/navigationState";
import BackButton from "../components/common/BackButton";
//URL CLOUDhttps://travelmonster-hfbzhpg0dxf9dwan.germanywestcentral-01.azurewebsites.net/
interface Flight {
  id: string;
  itineraries: {
    segments: {
      departureAirport: string;
      departureTime: string;
      arrivalAirport: string;
      arrivalTime: string;
      flightNumber: string;
      duration: number;
    }[];
    price: number;
  }[];
}

interface BookmarkedItem {
  id: string;
  type: 'attraction' | 'hotel' | 'flight';
  name: string;
  image?: string;
  details?: string;
}

const Flights = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    numberOfAdults: "1",
  });
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

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

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedItems');
    if (savedBookmarks) {
      setBookmarkedItems(new Set(JSON.parse(savedBookmarks)));
    }
  }, []);

  // Toggle bookmark
  const toggleBookmark = (item: BookmarkedItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(item.id)) {
      newBookmarks.delete(item.id);
    } else {
      newBookmarks.add(item.id);
      // Placeholder for API call
      console.log('Bookmark added:', item);
      // TODO: Add API call to save bookmark
    }
    setBookmarkedItems(newBookmarks);
    localStorage.setItem('bookmarkedItems', JSON.stringify([...newBookmarks]));
  };

  // Fetch flights from API
  const fetchFlights = async () => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(`https://travelmonster-hfbzhpg0dxf9dwan.germanywestcentral-01.azurewebsites.net/api/flights/offers?${query}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }

      const data = await response.json();
      const formattedFlights = data.map((flight: any, index: number) => ({
        id: String(index + 1),
        itineraries: flight.itineraries.map((itinerary: any) => ({
          segments: itinerary.segments.map((segment: any) => ({
            departureAirport: segment.departureAirport,
            departureTime: new Date(segment.departureTime).toLocaleString(),
            arrivalAirport: segment.arrivalAirport,
            arrivalTime: new Date(segment.arrivalTime).toLocaleString(),
            flightNumber: segment.flightNumber,
            duration: segment.duration,
          })),
          price: parseFloat(flight.price.total),
        })),
      }));

      setFlights(formattedFlights);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching flights.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFlights();
  };

  const handleSelectFlight = (flight: any) => {
    localStorage.setItem('selectedFlight', JSON.stringify({
      destination: searchParams.destination,
      flight: flight
    }));
    updateNavigationState('accommodations');
    navigate('/accommodations');
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton to="/" />
      
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Find Your Perfect Flight
          </h1>
          <p className="text-gray-600 text-lg">Search and compare flights to your dream destination</p>
        </motion.div>

        {/* Search Form */}
        <motion.form 
          variants={itemVariants}
          onSubmit={handleSearch} 
          className="bg-white p-8 rounded-2xl shadow-xl space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FaPlaneDeparture className="text-blue-600" />
                Origin
              </label>
              <input
                type="text"
                placeholder="e.g., JFK"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchParams.origin}
                onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FaPlaneArrival className="text-blue-600" />
                Destination
              </label>
              <input
                type="text"
                placeholder="e.g., CDG"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchParams.destination}
                onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FaCalendar className="text-blue-600" />
                Departure Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchParams.departureDate}
                onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FaCalendar className="text-blue-600" />
                Return Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchParams.returnDate}
                onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Passengers
              </label>
              <input
                type="number"
                placeholder="Number of adults"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchParams.numberOfAdults}
                onChange={(e) => setSearchParams({ ...searchParams, numberOfAdults: e.target.value })}
                min="1"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FaSearch />
            Search Flights
          </motion.button>
        </motion.form>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-12"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-xl text-center"
            >
              {error}
            </motion.div>
          )}

          {!loading && flights.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {flights.map((flight) => (
                <motion.div
                  key={flight.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative"
                  onClick={() => handleSelectFlight(flight)}
                >
                  {/* Bookmark Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => toggleBookmark({
                      id: flight.id,
                      type: 'flight',
                      name: `Flight ${flight.itineraries[0].segments[0].flightNumber}`,
                      details: `${flight.itineraries[0].segments[0].departureAirport} to ${flight.itineraries[0].segments[0].arrivalAirport}`
                    }, e)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
                  >
                    <FaHeart className={`w-5 h-5 ${
                      bookmarkedItems.has(flight.id)
                        ? 'text-red-500'
                        : 'text-gray-400'
                    }`} />
                  </motion.button>

                  {flight.itineraries.map((itinerary: any, idx: number) => (
                    <div key={idx} className="mb-6 last:mb-0">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-lg text-gray-800">Flight {idx + 1}</span>
                        <span className="text-2xl font-bold text-green-600">{itinerary.price.toFixed(2)} EUR</span>
                      </div>

                      {itinerary.segments.map((segment: any, sIdx: number) => (
                        <div key={sIdx} className="border-l-4 border-blue-600 pl-4 pb-4 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-semibold text-lg">
                                  {segment.departureAirport} 
                                  <FaExchangeAlt className="inline mx-2 text-blue-600" /> 
                                  {segment.arrivalAirport}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p className="flex items-center gap-2">
                                  <FaPlaneDeparture className="text-blue-600" />
                                  Departure: {segment.departureTime}
                                </p>
                                <p className="flex items-center gap-2">
                                  <FaPlaneArrival className="text-blue-600" />
                                  Arrival: {segment.arrivalTime}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <FaClock className="text-blue-600" />
                                {segment.duration} min
                              </div>
                              <div className="text-sm text-gray-500">
                                Flight {segment.flightNumber}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Flights;
