import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../store/slices/userSlice';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser, bookmarks, travelHistory } = useAppSelector(state => state.user);

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Please log in to view your profile</h1>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4">
          {currentUser.avatar && (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-20 h-20 rounded-full"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{currentUser.name}</h1>
            <p className="text-gray-600">{currentUser.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <p className="text-gray-600">No bookmarks yet</p>
          ) : (
            <ul className="space-y-2">
              {bookmarks.map(bookmark => (
                <li key={bookmark} className="p-2 hover:bg-gray-50 rounded">
                  {bookmark}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Travel History</h2>
          {travelHistory.length === 0 ? (
            <p className="text-gray-600">No travel history yet</p>
          ) : (
            <ul className="space-y-2">
              {travelHistory.map((trip, index) => (
                <li key={index} className="p-2 hover:bg-gray-50 rounded">
                  {trip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button
        onClick={() => dispatch(logout())}
        className="mt-8 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
      >
        Log Out
      </button>
    </motion.div>
  );
};

export default Profile; 