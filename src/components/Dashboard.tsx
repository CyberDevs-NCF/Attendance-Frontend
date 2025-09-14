import React from 'react';

interface User {
  email: string;
  name: string;
  role: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  // Dashboard implementation
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via[40%]-purple-800 to-red-800 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
        <p className="mb-6">Role: {user.role}</p>
        <button
            onClick={onLogout}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
        >
            Logout
        </button>
        {/* Dashboard content */}
    </div>

  );
};

export default Dashboard;