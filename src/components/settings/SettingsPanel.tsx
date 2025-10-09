import React from "react";
import { motion } from "framer-motion";
import { THEMES } from "../../utils/constants";

interface SettingsPanelProps {
  onLogout: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onLogout,
}) => {
  return (
    <div className="w-[90%] max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-medium text-white">
              {localStorage.getItem("fullName")?.charAt(0) ?? ""}
            </span>
          </div>
          <div>
            <h1 className="text-blue text-2xl font-semibold">
              {localStorage.getItem("fullName") ?? ""}
            </h1>
            <p className="text-gray-300 text-sm">
              {localStorage.getItem("email") ?? ""}
            </p>
            <p className="text-gray-400 text-xs">Officer</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 mt-4 md:mt-0 cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Background Theme Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20 p-6"
        >
          <h3 className="text-xl font-semibold text-blue mb-6">
            Background Theme
          </h3>
          <div className="space-y-3">
            {THEMES.map((theme) => (
              <div
                key={theme.name}
                className={`flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer ${
                  theme.active
                    ? "bg-cyan-500 bg-opacity-20 border border-cyan-400 border-opacity-30"
                    : "bg-white bg-opacity-5 hover:bg-white hover:bg-opacity-10 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{theme.icon}</span>
                  <span className="text-blue font-medium">{theme.name}</span>
                </div>
                {theme.active && (
                  <span className="bg-cyan-400 text-cyan-900 px-2 py-1 rounded-full text-xs font-semibold">
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Account Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20 p-6"
        >
          <h3 className="text-xl font-semibold text-blue mb-6">
            Account Information
          </h3>
          <div className="space-y-4">
            {/* <div className="flex justify-between items-center py-2">
              <span className="text-gray-300">Username</span>
              <span className="text-blue font-medium">{user.name.toLowerCase().replace(' ', '')}</span>
            </div> */}
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">Last Login</span>
              <span className="text-blue font-medium">Today at 10:30 AM</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">Account Status</span>
              <span className="bg-green-500 text-blue px-3 py-1 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
