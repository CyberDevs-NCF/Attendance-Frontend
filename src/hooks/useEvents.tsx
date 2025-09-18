import { useState } from 'react';
import type { Event } from '../types';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Intramurals',
      location: 'NCF',
      date: '2025-03-15',
      time: 'AM-PM',
      description: 'Annual sports competition for all students',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'GDAP Expo',
      location: 'ST Quad',
      date: '2025-11-05',
      time: 'AM-PM',
      description: 'Game Development showcase event',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'CCS DAY',
      location: 'ST Quad',
      date: '2025-08-22',
      time: 'AM-PM',
      description: 'College of Computer Studies celebration',
      status: 'ongoing'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Event['status']>('all');

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: Date.now(),
      ...eventData
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (eventData: Event) => {
    setEvents(events.map(event => event.id === eventData.id ? eventData : event));
  };

  const deleteEvent = (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const getEventById = (id: number) => events.find(event => event.id === id);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return {
    events,
    filteredEvents,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById
  };
};