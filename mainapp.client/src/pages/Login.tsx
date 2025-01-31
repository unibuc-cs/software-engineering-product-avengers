// src/components/Login.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store'; // Import the typed dispatch
import { loginUser } from '../store/slices/userSlice'; // Import the loginUser action
import { useNavigate, useLocation } from 'react-router-dom'; // For navigation and location

interface LocationState {
  registrationSuccess?: boolean;
  message?: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check for registration success message
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.registrationSuccess) {
      setSuccessMessage(state.message || 'Registration successful! Please log in.');
      // Clean up the location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      await dispatch(loginUser({ email, password })).unwrap(); // Dispatch loginUser action
      navigate('/profile'); // Redirect to profile page after successful login
    } catch (err) {
      setError('Invalid email or password.'); // Handle errors
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Log In</h1>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
