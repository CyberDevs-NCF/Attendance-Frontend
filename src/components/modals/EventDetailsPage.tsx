import React, { useState } from 'react';
import { ArrowLeft, QrCode, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Event, Attendee } from '../../types';
import { getStatusColor } from '../../utils/constants';

interface EventDetailsPageProps {
  event: Event & { attendees?: Attendee[] };
  onBack: () => void;
  onScanQR?: () => void;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ event, onBack, onScanQR }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('All Blocks');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');

  const attendeesWithExample = event.attendees && event.attendees.length > 0
    ? event.attendees
    : [
        { id: '2021001', name: 'John Doe', block: 'A', year: '3rd Year', course: 'BSCS' },
        { id: '2021002', name: 'Jane Smith', block: 'B', year: '2nd Year', course: 'BSIT' },
        { id: '2021003', name: 'Michael Johnson', block: 'A', year: '1st Year', course: 'BSCS' },
        { id: '2021004', name: 'Emily Davis', block: 'C', year: '4th Year', course: 'BSIT' },
        { id: '2021005', name: 'Chris Lee', block: 'B', year: '3rd Year', course: 'BSCS' },
        { id: '2021006', name: 'Sarah Kim', block: 'A', year: '2nd Year', course: 'BSIT' },
        { id: '2021007', name: 'David Brown', block: 'C', year: '1st Year', course: 'BSCS' },
        { id: '2021008', name: 'Jessica Wilson', block: 'B', year: '4th Year', course: 'BSIT' },
        { id: '2021009', name: 'Daniel Martinez', block: 'A', year: '3rd Year', course: 'BSCS' },
        { id: '2021010', name: 'Ashley Garcia', block: 'C', year: '2nd Year', course: 'BSIT' },
        { id: '2021011', name: 'Matthew Clark', block: 'B', year: '1st Year', course: 'BSCS' },
        { id: '2021012', name: 'Olivia Lewis', block: 'A', year: '4th Year', course: 'BSIT' },
        { id: '2021013', name: 'Joshua Walker', block: 'C', year: '3rd Year', course: 'BSCS' },
        { id: '2021014', name: 'Sophia Hall', block: 'B', year: '2nd Year', course: 'BSIT' },
        { id: '2021015', name: 'Ryan Allen', block: 'A', year: '1st Year', course: 'BSCS' },
        { id: '2021016', name: 'Megan Young', block: 'C', year: '4th Year', course: 'BSIT' },
        { id: '2021017', name: 'Brandon Hernandez', block: 'B', year: '3rd Year', course: 'BSCS' },
        { id: '2021018', name: 'Natalie King', block: 'A', year: '2nd Year', course: 'BSIT' },
        { id: '2021019', name: 'Justin Wright', block: 'C', year: '1st Year', course: 'BSCS' },
        { id: '2021020', name: 'Victoria Lopez', block: 'B', year: '4th Year', course: 'BSIT' }
      ];

  // Filter attendees based on search and filters
  const filteredAttendees = attendeesWithExample?.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = selectedBlock === 'All Blocks' || attendee.block === selectedBlock;
    const matchesYear = selectedYear === 'All Years' || attendee.year === selectedYear;
    const matchesCourse = selectedCourse === 'All Courses' || attendee.course === selectedCourse;
    
    return matchesSearch && matchesBlock && matchesYear && matchesCourse;
  }) || [];

  // Get unique values for filter options
  const blocks = ['All Blocks', ...Array.from(new Set(event.attendees?.map(a => a.block) || []))];
  const years = ['All Years', ...Array.from(new Set(event.attendees?.map(a => a.year) || []))];
  const courses = ['All Courses', ...Array.from(new Set(event.attendees?.map(a => a.course) || []))];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="text-gray-800 h-[90vh] bg-gray-100 p-6 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-lg font-medium">Back</span>
        </button>
        <button
          onClick={onScanQR}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <QrCode size={16} />
          <span>Scan QR Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Event Details Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Event Details</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 text-sm">Title: </span>
              <span className="text-gray-800 font-medium">{event.title}</span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Date: </span>
              <span className="text-gray-800 font-medium">{event.date}</span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Location: </span>
              <span className="text-gray-800 font-medium">{event.location}</span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Description: </span>
              <span className="text-gray-800 font-medium">{event.description || event.title}</span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Total Attendees: </span>
              <span className="text-gray-800 font-semibold">{event.attendees?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Search & Filter</h2>
          <div className="space-y-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Filter Dropdowns */}
            <div className="flex space-x-3">
              <div className="relative">
                <select
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {blocks.map(block => (
                    <option key={block} value={block}>
                      {block}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              <div className="relative">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {courses.map(course => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="mt-8 bg-white rounded-lg shadow-sm overflow-auto flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Attendees ({filteredAttendees.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Block</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Year</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Course</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Time-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee, index) => (
                  <tr
                    key={attendee.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">{attendee.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{attendee.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{attendee.block}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{attendee.year}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{attendee.course}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-right">Time-in</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                    No attendees found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};