import type { ComponentType } from "react";

export interface Attendee {
  id?: string;
  _id?: string;
  name: string;
  block: string;
  year: string;
  course: string;
  timeIn?: string;
  timeInAM?: string;
  timeOutAM?: string;
  timeInPM?: string;
  timeOutPM?: string;
}

export interface Event {
  id?: any;
  _id?: string;
  title: string;
  location: string;
  date: string;
  time: string;
  description?: string;
  status: "upcoming" | "ongoing" | "completed";
  attendees?: Attendee[];
}

export interface User {
  email: string;
  fullname: string;
}

export interface EventsDashboardProps {
  email: string;
  fullName: string;
  onLogout: () => void;
}

export interface SidebarLink {
  label: string;
  icon: ComponentType<{ className?: string }>; // 👈 make it a component
  href?: string;
}

// (Attendee defined above)

export interface Theme {
  name: string;
  icon: string;
  active: boolean;
}

export const getUserFromLocalStorage = (): User => ({
  email: localStorage.getItem("email") ?? "",
  fullname: localStorage.getItem("fullName") ?? "",
});
