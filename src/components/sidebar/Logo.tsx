import React from 'react';
import { motion } from 'framer-motion';

// Import your logo images here
import CyberDevs from '../../assets/CyberDevs.png';
import ComputerStudies from '../../assets/computerstudies.png';
import StudentCouncil from '../../assets/csc.png';

export const Logo: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center space-y-2 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Logo Row */}
      <div className="flex items-center justify-center space-x-2">
        {/* Computer Studies Logo */}
        <motion.div
          className="w-15 h-15 mt-6 flex items-center justify-center flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: -5 }}
        >
          <motion.img
            src={ComputerStudies}
            alt="Computer Studies Logo"
            className="w-full h-full object-contain rounded-full"
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </motion.div>
        
        {/* CyberDevs Logo - Main/Center logo */}
        <motion.div
          className="w-20 h-20 flex items-center justify-center flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
          whileHover={{ scale: 1.15, rotate: 8 }}
        >
          <motion.img
            src={CyberDevs}
            alt="CyberDevs Logo"
            className="w-full h-full object-contain rounded-full"
          />
        </motion.div>

        {/* Student Council Logo */}
        <motion.div
          className="w-15 h-15 mt-6 flex items-center justify-center flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <motion.img
            src={StudentCouncil}
            alt="Student Council Logo"
            className="w-full h-full object-contain rounded-full"
            whileHover={{ rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export const LogoIcon: React.FC = () => {
  return (
    <div className="flex items-center justify-center px-4">
      {/* CyberDevs Logo - Collapsed state */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-18 h-18 flex items-center justify-center flex-shrink-0"
      >
        <img
          src={CyberDevs}
          alt="CyberDevs Logo"
          className="w-18 h-18 object-contain rounded-full"
        />
      </motion.div>
    </div>
  );
};

