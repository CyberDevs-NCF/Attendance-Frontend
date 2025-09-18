import React from "react";

interface AuthBackgroundProps {
  children: React.ReactNode;
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via[40%]-purple-800 to-red-800 flex flex-col items-center justify-start p-4 py-6 sm:py-3">
      {children}
    </div>
  );
};

export default AuthBackground;