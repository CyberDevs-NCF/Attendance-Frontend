import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Light backdrop with subtle blur */}
          <motion.div 
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(12px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-br from-white/30 via-gray-100/40 to-white/20"
          />
          
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.85, 
              y: 40,
              rotateX: 10
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotateX: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.85, 
              y: 40,
              rotateX: 10
            }}
            transition={{ 
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="relative w-[95%] max-w-6xl max-h-[95vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* White Glassmorphism container */}
            <div className="relative rounded-3xl border border-white/50 bg-white/30 backdrop-blur-3xl shadow-2xl overflow-hidden">
              {/* White gradient overlay for enhanced glass effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/50 via-white/30 to-white/20 pointer-events-none"></div>
              
              {/* Inner shadow for depth */}
              <div className="absolute inset-0 rounded-3xl shadow-inner shadow-gray-200/30 pointer-events-none"></div>
              
              {/* Content container with proper spacing and scroll */}
              <div className="relative p-8 max-h-[95vh] overflow-y-auto">
                {/* Content without color override - let children handle their own colors */}
                <div className="w-full">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};