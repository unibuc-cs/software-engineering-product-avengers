import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const Flights = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    numberOfAdults: "1",
  });
  const [flights, setFlights] = useState<any[]>([]); // Use any[] for now, since we need to store the full flight data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch flights from API
  const fetchFlights = async () => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(`http://localhost:5190/api/flights/offers?${query}`);
      console.log(response);
      if (!response.ok) {
        throw new Error("No flights available for this search");
      }

      const data = await response.json();

      // 🔹 Convert API response to expected format
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Find Flights</h1>

      {/* 🔹 Search Form */}
      <form onSubmit={handleSearch} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Origin (e.g., JFK)"
            className="border p-2 rounded"
            value={searchParams.origin}
            onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Destination (e.g., CDG)"
            className="border p-2 rounded"
            value={searchParams.destination}
            onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
            required
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={searchParams.departureDate}
            onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
            required
          />
          <input
            type="date"
            className="border p-2 rounded"
            placeholder="Return Date (Optional)"
            value={searchParams.returnDate}
            onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
          />
          <input
            type="number"
            placeholder="Adults"
            className="border p-2 rounded"
            value={searchParams.numberOfAdults}
            onChange={(e) => setSearchParams({ ...searchParams, numberOfAdults: e.target.value })}
            min="1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search Flights
        </button>
      </form>

      {/* 🔹 Display Flights */}
      {loading && <p>Loading flights...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/flights/${flight.id}`)}
          >
            {flight.itineraries.map((itinerary: any, idx: number) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Itinerary {idx + 1}</span>
                  <span className="text-green-600 font-bold">{itinerary.price.toFixed(2)} EUR</span>
                </div>

                {/* Display all segments in this itinerary */}
                {itinerary.segments.map((segment: any, sIdx: number) => (
                  <div key={sIdx} className="border-b py-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {segment.departureAirport} → {segment.arrivalAirport}
                      </span>
                      <span className="text-sm text-gray-600">
                        Flight {segment.flightNumber} | {segment.duration} min
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Departure: {segment.departureTime}</p>
                      <p>Arrival: {segment.arrivalTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flights;
