import React from "react";
import { Plus /*, ChevronDown*/ } from "lucide-react";
import type { User } from "../../types";

interface HeaderProps {
  user: User;
  onAddEvent: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onAddEvent }) => {
  return (
    <>
      {/* User Info Section */}
      <div className="flex justify-end items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-sm text-white font-medium">
              {user?.email?.charAt(0) ?? ""}
            </span>
          </div>
          <span className="text-white hidden md:inline">
            {localStorage.getItem("fullName") ?? ""}
          </span>
          {/* <ChevronDown size={16} className="text-white hidden md:inline" /> */}
        </div>
      </div>

      {/* Title and Add Button Section */}
      <div className="w-full flex justify-between items-center mt-5 mb-1 py-4">
        <h1 className="text-white text-xl md:text-2xl font-semibold">
          Events Management
        </h1>

        <button
          onClick={onAddEvent}
          className="bg-blue-500 w-[130px] hover:bg-blue-600 text-center text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={16} />
          <span>Add Event</span>
        </button>
      </div>
    </>
  );
};
