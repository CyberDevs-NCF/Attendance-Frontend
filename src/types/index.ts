import type { ComponentType } from "react";

export interface Event {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  description?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface User {
  email: string;
  name: string;
}

export interface EventsDashboardProps {
  user: User;
  onLogout: () => void;
  
}
export interface SidebarLink {
  label: string;
  icon: ComponentType<{ className?: string }>; // 👈 make it a component
  href?: string;
}