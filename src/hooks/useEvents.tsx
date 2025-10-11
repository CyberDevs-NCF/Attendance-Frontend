import { useState } from "react";
import type { Event } from "../types";

const generateObjectId = () => {
  // Create a Mongo-like ObjectId: 4-byte timestamp + 16 hex chars
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const random = Array.from({ length: 16 })
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
  const id = (timestamp + random).padEnd(24, "0").slice(0, 24);
  return id;
};

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Event["status"]>(
    "all"
  );

  const addEvent = (eventData: Omit<Event, "_id">) => {
    const newEvent: Event = {
      _id: generateObjectId(),
      ...eventData,
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (eventData: Event) => {
    setEvents(
      events.map((event) => (event._id === eventData._id ? eventData : event))
    );
  };

  const deleteEvent = (eventId?: string) => {
    if (!eventId) return;
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event._id !== eventId));
    }
  };

  const getEventById = (id?: string) =>
    events.find((event) => event._id === id);

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
