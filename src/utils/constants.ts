import { Calendar, Settings, UserRoundPlus } from 'lucide-react';
import type { Event } from '../types';

export const NAVIGATION_LINKS = [
  {
    label: "Events",
    href: "#",
    icon: Calendar,
  },
  {
    label: "Registration", 
    href: "#",
    icon: UserRoundPlus,
  },
];

export const SETTINGS_LINK = {
  label: "Settings",
  href: "#",
  icon: Settings,
};

export const getStatusColor = (status: Event['status']): string => {
  switch (status) {
    case 'upcoming': return 'bg-blue-500';
    case 'ongoing': return 'bg-green-500'; 
    case 'completed': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

export const THEMES = [
  { name: "Light Theme", icon: "☀️", active: false },
  { name: "Dark Theme", icon: "🌙", active: false },
  { name: "CyberDevs Theme", icon: "⚡", active: true }
];