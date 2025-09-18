import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { Event } from '../../types';

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: 'all' | Event['status'];
  setFilterStatus: (status: 'all' | Event['status']) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus
}) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue" size={16} />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-blue placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Filter size={16} className="text-blue" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-blue focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all" className="bg-gray-800 text-white">All Status</option>
          <option value="upcoming" className="bg-gray-800 text-white">Upcoming</option>
          <option value="ongoing" className="bg-gray-800 text-white">Ongoing</option>
          <option value="completed" className="bg-gray-800 text-white">Completed</option>
        </select>
      </div>
    </div>
  );
};