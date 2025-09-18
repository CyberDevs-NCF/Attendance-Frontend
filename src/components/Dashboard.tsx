"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthBackground from "./AuthBackground";

// Component imports
import { Modal } from './ui/Modal';
import { SearchFilter } from './ui/SearchFilter';
import { EventForm } from './forms/EventForm';
import { EventDetailsModal } from './modals/EventDetailsModal';
import { Logo, LogoIcon } from './sidebar/Logo';
import { Sidebar, SidebarBody, SidebarLinkComponent } from './sidebar/Sidebar';
import { EventsTable } from './events/EventsTable';
import { EventsCards } from './events/EventsCards';
import { SettingsPanel } from './settings/SettingsPanel';
import { Header } from './layout/Header';

// Hooks and utilities
import { useEvents } from '../hooks/useEvents';
import { NAVIGATION_LINKS, SETTINGS_LINK } from '../utils/constants';

// Types
import type { EventsDashboardProps, Event, User } from '../types';

const Dashboard: React.FC<EventsDashboardProps> = ({ user, onLogout }) => {
  // Sidebar state
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Events");

  // Modal states
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Events management
  const {
    filteredEvents,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById
  } = useEvents();

  // Event handlers
  const handleViewDetails = (eventId: number) => {
    const event = getEventById(eventId);
    if (event) {
      setSelectedEvent(event);
      setShowEventDetails(true);
    }
  };

  const handleUpdate = (eventId: number) => {
    const event = getEventById(eventId);
    if (event) {
      setEditingEvent(event);
      setShowEventForm(true);
    }
  };

  const handleDelete = (eventId: number) => {
    deleteEvent(eventId);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleSaveEvent = (eventData: Event) => {
    if (editingEvent) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleCancelForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const renderMainContent = () => {
    if (activeLink === "Settings") {
      return <SettingsPanel user={user} onLogout={onLogout} />;
    }

    if (activeLink === "Registration") {
      return (
        <div className="text-center text-white py-8">
          <h2 className="text-2xl font-semibold mb-4">Registration Management</h2>
          <p className="text-gray-300">Registration features coming soon...</p>
        </div>
      );
    }

    // Default Events view
    return (
      <>
        <Header user={user} onAddEvent={handleAddEvent} />
        
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* Events Display */}
        <EventsTable
          events={filteredEvents}
          onViewDetails={handleViewDetails}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />

        <EventsCards
          events={filteredEvents}
          onViewDetails={handleViewDetails}
          onEdit={handleUpdate}
          onDelete={handleDelete}
          variant="tablet"
        />

        <EventsCards
          events={filteredEvents}
          onViewDetails={handleViewDetails}
          onEdit={handleUpdate}
          onDelete={handleDelete}
          variant="mobile"
        />
      </>
    );
  };

  return (
    <AuthBackground>
      <div className={`group/sidebar ${open ? 'sidebar-open' : ''}`}>
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}

              <br />

              {open && (
                <div className="px-4 mt-4">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white text-lg text-center whitespace-nowrap tracking-wide"
                  >
                    Hello! {user.name}
                  </motion.p>
                </div>
              )}

              <br />

              <hr className={`transition-all duration-300 ease-in-out border-white border-opacity-60 ${
                open ? 'w-55 mx-auto' : 'w-full'
              }`} />

              {/* Navigation Links */}
              <div className="mt-8 flex flex-col gap-2 px-4 flex-1">
                {NAVIGATION_LINKS.map((link, idx) => (
                  <SidebarLinkComponent
                    key={idx}
                    link={link}
                    isActive={activeLink === link.label}
                    onClick={() => setActiveLink(link.label)}
                  />
                ))}
              </div>


              {/* Settings Link */}
              <div className="px-4 pb-4">
                <SidebarLinkComponent
                link={SETTINGS_LINK} // ✅ Just pass the component
                isActive={activeLink === SETTINGS_LINK.label}
                onClick={() => setActiveLink(SETTINGS_LINK.label)}
              />

                {/* {open && (
                  <span className="whitespace-nowrap ml-11">
                    {SETTINGS_LINK.label}
                  </span>
                )} */}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className={`w-[75%] transition-all duration-300 ease-in-out p-4 md:p-8 ${open ? 'ml-60' : 'ml-20'}`}>
        {renderMainContent()}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showEventForm && (
          <Modal isOpen={showEventForm} onClose={handleCancelForm}>
            <EventForm
              event={editingEvent || undefined}
              onSave={handleSaveEvent}
              onCancel={handleCancelForm}
            />
          </Modal>
        )}

        {showEventDetails && selectedEvent && (
          <Modal isOpen={showEventDetails} onClose={() => setShowEventDetails(false)}>
            <EventDetailsModal
              event={selectedEvent}
              onClose={() => setShowEventDetails(false)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </AuthBackground>
  );
};

export default Dashboard;