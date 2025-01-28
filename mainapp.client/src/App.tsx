import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Accommodations from './pages/Accommodations';
import Map from './pages/Map';
import Itinerary from './pages/Itinerary';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/map" element={<Map />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;