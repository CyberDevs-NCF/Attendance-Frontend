import React from 'react';
import type { SidebarLink } from '../../types';

interface SidebarProps {
children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, open, setOpen }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-indigo-900 bg-opacity-50 backdrop-blur-sm border-r border-white border-opacity-10 transition-all duration-300 ease-in-out z-20 ${
        open ? 'w-60' : 'w-19'
      }`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
    </div>
  );
};

interface SidebarBodyProps {
  className?: string;
  children: React.ReactNode;
}

export const SidebarBody: React.FC<SidebarBodyProps> = ({ className, children }) => {
  return (
    <div className={`flex flex-col h-full py-6 ${className}`}>
      {children}
    </div>
  );
};

interface SidebarLinkProps {
  link: SidebarLink;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarLinkComponent: React.FC<SidebarLinkProps> = ({ 
  link, 
  isActive = false, 
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all group/item cursor-pointer ${
        isActive
          ? 'bg-blue-600 bg-opacity-80 text-white shadow-lg' 
          : 'text-white hover:bg-white hover:text-black hover:bg-opacity-10'
      }`}
    >
      <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-300'}`}>
        {React.createElement(link.icon, { className: "h-5 w-5 shrink-0" })}
      </div>
      <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {link.label}
      </span>
    </div>
  );
};