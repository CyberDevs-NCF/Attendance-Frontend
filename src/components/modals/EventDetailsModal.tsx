import React from 'react';
import { X } from 'lucide-react';
import type { Event } from '../../types';
import { getStatusColor } from '../../utils/constants';

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Event Details</h2>
        <button onClick={onClose} className="text-gray-300 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-blue-300">{event.title}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
            <p className="text-white">{event.location}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
            <p className="text-white">{event.date}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
            <p className="text-white">{event.time}</p>
          </div>
        </div>

        {event.description && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <p className="text-white bg-white bg-opacity-5 p-3 rounded-lg">{event.description}</p>
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};