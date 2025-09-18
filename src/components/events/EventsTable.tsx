import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Event } from '../../types';
import { getStatusColor } from '../../utils/constants';

interface EventsTableProps {
  events: Event[];
  onViewDetails: (eventId: number) => void;
  onEdit: (eventId: number) => void;
  onDelete: (eventId: number) => void;
}

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue border-opacity-10 p-8"
      >
        <div className="text-center text-gray-400">
          No events found matching your criteria
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="hidden xl:block bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue border-opacity-10"
    >
      <table className="w-full">
        <thead>
          <tr className="bg-blue bg-opacity-10 border-b border-blue border-opacity-10">
            <th className="text-left py-4 px-6 text-blue font-medium">Title</th>
            <th className="text-left py-4 px-6 text-blue font-medium">Location</th>
            <th className="text-left py-4 px-6 text-blue font-medium">Date</th>
            <th className="text-left py-4 px-6 text-blue font-medium">Time</th>
            <th className="text-left py-4 px-6 text-blue font-medium">Status</th>
            <th className="text-left py-4 px-6 text-blue font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr
              key={event.id}
              className={`border-b border-blue border-opacity-5 ${
                index % 2 === 0 ? 'bg-blue bg-opacity-5' : 'bg-transparent'
              } hover:bg-blue hover:bg-opacity-10 transition-colors`}
            >
              <td className="py-4 px-6 text-blue">{event.title}</td>
              <td className="py-4 px-6 text-blue">{event.location}</td>
              <td className="py-4 px-6 text-blue">{event.date}</td>
              <td className="py-4 px-6 text-blue">{event.time}</td>
              <td className="py-4 px-6">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(event.status)}`}
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </td>
              <td className="py-4 px-6">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewDetails(event.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1 transition-colors"
                  >
                    <Eye size={12} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => onEdit(event.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1 transition-colors"
                  >
                    <Edit size={12} />
                    <span>Update</span>
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1 transition-colors"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};
