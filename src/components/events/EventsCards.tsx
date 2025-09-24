import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { Event } from '../../types';
import { getStatusColor } from '../../utils/constants';

interface EventsCardsProps {
  events: Event[];
  onViewDetails: (eventId: number) => void;
  onEdit: (eventId: number) => void;
  onDelete: (eventId: number) => void;
  variant?: 'tablet' | 'mobile';
}

export const EventsCards: React.FC<EventsCardsProps> = ({
  events,
  onViewDetails,
  onEdit,
  onDelete,
  variant = 'tablet'
}) => {
//   if (events.length === 0) {
//     return (
//       <div className="text-center text-gray-400 py-8">
//         No events found matching your criteria
//       </div>
//     );
//   }

  if (variant === 'tablet') {
    return (
      <div className="hidden md:block xl:hidden space-y-4 mt-6">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-10 flex flex-col md:flex-row items-center justify-between"
          >
            <div className="flex-1 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-blue font-semibold text-xl">{event.title}</h3>
                <p className="text-blue text-sm">📍 {event.location}</p>
                <p className="text-blue text-sm">📅 {event.date}</p>
                <p className="text-blue text-sm">🕒 {event.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(event.status)}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => onViewDetails(event.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-1 transition-colors"
              >
                <Eye size={14} />
                <span>View</span>
              </button>
              <button
                onClick={() => onEdit(event.id)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-1 transition-colors"
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-1 transition-colors"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Mobile variant
  return (
    <div className="md:hidden space-y-4">
      {events.map((event) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-10"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-blue font-medium text-lg">{event.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <p className="text-blue text-sm">📍 {event.location}</p>
            <p className="text-blue text-sm">📅 {event.date}</p>
            <p className="text-blue text-sm">🕒 {event.time}</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails(event.id)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center space-x-1 transition-colors"
            >
              <Eye size={12} />
              <span>View</span>
            </button>
            <button
              onClick={() => onEdit(event.id)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center space-x-1 transition-colors"
            >
              <Edit size={12} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center space-x-1 transition-colors"
            >
              <Trash2 size={12} />
              <span>Delete</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};