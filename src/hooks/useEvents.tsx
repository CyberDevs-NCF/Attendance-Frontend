import { useState } from "react";
import type { Event } from "../types";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Event["status"]>(
    "all"
  );

  const addEvent = (eventData: Omit<Event, "id">) => {
    const newEvent: Event = {
      id: Date.now(),
      ...eventData,
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (eventData: Event) => {
    setEvents(
      events.map((event) => (event._id === eventData._id ? eventData : event))
    );
  };

  const deleteEvent = (eventId: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  const getEventById = (id: number) => events.find((event) => event.id === id);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || event.status === filterStatus;
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
    getEventById,
  };
};
