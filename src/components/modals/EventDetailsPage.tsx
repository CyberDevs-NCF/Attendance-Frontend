import React, { useState } from 'react';
import { ArrowLeft, QrCode, ChevronDown, Clock} from 'lucide-react';
import { motion } from 'framer-motion';
import QRScannerPage from './QRScannerPage';

interface Attendee {
  id: string;
  name: string;
  block: string;
  year: string;
  course: string;
  timeInAM?: string;
  timeOutAM?: string;
  timeInPM?: string;
  timeOutPM?: string;
}


interface Event {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  description?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  attendees?: Attendee[];
}

interface EventDetailsPageProps {
  event: Event & { attendees?: Attendee[] };
  onBack: () => void;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ event, onBack }) => {
  const [attendees, setAttendees] = useState<Attendee[]>(event.attendees || []);
  const [showScanner, setShowScanner] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('All Blocks');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');

  const handleApproveAttendee = (newAttendee: Attendee, time: string, isTimeIn: boolean, period: 'AM' | 'PM') => {
    setAttendees(prev => {
      const exists = prev.find(a => a.id === newAttendee.id);

      if (exists) {
        return prev.map(a =>
          a.id === newAttendee.id
            ? {
                ...a,
                ...(isTimeIn && period === 'AM' ? { timeInAM: time } : {}),
                ...(!isTimeIn && period === 'AM' ? { timeOutAM: time } : {}),
                ...(isTimeIn && period === 'PM' ? { timeInPM: time } : {}),
                ...(!isTimeIn && period === 'PM' ? { timeOutPM: time } : {}),
              }
            : a
        );
      } else {
        return [
          ...prev,
          {
            ...newAttendee,
            timeInAM: isTimeIn && period === 'AM' ? time : undefined,
            timeOutAM: !isTimeIn && period === 'AM' ? time : undefined,
            timeInPM: isTimeIn && period === 'PM' ? time : undefined,
            timeOutPM: !isTimeIn && period === 'PM' ? time : undefined,
          }
        ];
      }
    });
    setShowScanner(false);
  };


  // Filter attendees based on search and filters
  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = selectedBlock === 'All Blocks' || attendee.block === selectedBlock;
    const matchesYear = selectedYear === 'All Years' || attendee.year === selectedYear;
    const matchesCourse = selectedCourse === 'All Courses' || attendee.course === selectedCourse;

    return matchesSearch && matchesBlock && matchesYear && matchesCourse;
  });

  // Get unique values for filter options
  const blocks = ['All Blocks', ...Array.from(new Set(attendees.map(a => a.block)))];
  const years = ['All Years', ...Array.from(new Set(attendees.map(a => a.year)))];
  const courses = ['All Courses', ...Array.from(new Set(attendees.map(a => a.course)))];

  // Calculate statistics
  const totalAttendees = attendees.length;
  const presentCount = attendees.filter(a => a.timeInAM || a.timeInPM).length;
  const attendanceRate = totalAttendees > 0 ? Math.round((presentCount / totalAttendees) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="text-gray-800 h-[90vh] bg-gray-100 p-6 flex flex-col relative"
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
          onClick={() => setShowScanner(true)} // ✅ Open scanner modal
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <QrCode size={16} />
          <span>Scan QR Code</span>
        </button>
      </div>

      {/* Event + Stats + Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Event Details Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Event Details</h2>
          <div className="space-y-3">
            <div><span className="text-gray-600 text-sm">Title: </span><span className="text-gray-800 font-medium">{event.title}</span></div>
            <div><span className="text-gray-600 text-sm">Date: </span><span className="text-gray-800 font-medium">{event.date}</span></div>
            <div><span className="text-gray-600 text-sm">Time: </span><span className="text-gray-800 font-medium">{event.time}</span></div>
            <div><span className="text-gray-600 text-sm">Location: </span><span className="text-gray-800 font-medium">{event.location}</span></div>
            <div><span className="text-gray-600 text-sm">Description: </span><span className="text-gray-800 font-medium">{event.description || event.title}</span></div>
          </div>
        </div>

        {/* Attendance Statistics */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Total Attendees:</span>
              <span className="text-2xl font-bold text-gray-800">{totalAttendees}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Attendance Rate:</span>
                <span className="text-lg font-semibold text-blue-600">{attendanceRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Search & Filter</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <select value={selectedBlock} onChange={(e) => setSelectedBlock(e.target.value)} className="w-full appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {blocks.map(block => <option key={block} value={block}>{block}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              <div className="relative">
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              <div className="relative">
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {courses.map(course => <option key={course} value={course}>{course}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-auto flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Attendees ({filteredAttendees.length})</h3>
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
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Time In(AM)</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Time Out(AM)</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Time In(PM)</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Time Out(PM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map(attendee => (
                  <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900">{attendee.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{attendee.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{attendee.block}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{attendee.year}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{attendee.course}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-center">
                      {attendee.timeInAM ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <Clock size={12} />
                          {attendee.timeInAM}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-center">
                      {attendee.timeOutAM ? (
                        <span className="inline-flex items-center gap-1 text-red-600">
                          <Clock size={12} />
                          {attendee.timeOutAM}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-center">
                      {attendee.timeInPM ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <Clock size={12} />
                          {attendee.timeInPM}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-center">
                      {attendee.timeOutPM ? (
                        <span className="inline-flex items-center gap-1 text-red-600">
                          <Clock size={12} />
                          {attendee.timeOutPM}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
                    No attendees found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-4">
            <QRScannerPage
              onClose={() => setShowScanner(false)}
              onScan={() => {}}
              onApproveAttendee={handleApproveAttendee}
              headerTitle="Scan QR Code"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EventDetailsPage;
