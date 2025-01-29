// src/components/Login.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store'; // Import the typed dispatch
import { loginUser } from '../store/slices/userSlice'; // Import the loginUser action
import { useNavigate } from 'react-router-dom'; // For navigation

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      {error && <p className="text-red-600">{error}</p>}
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
