import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

interface BackButtonProps {
  to: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="fixed bottom-6 left-6 z-[1000]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(to)}
        className="px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300"
      >
        <FaArrowLeft />
        Back
      </motion.button>
    </motion.div>
  );
};

export default BackButton; 