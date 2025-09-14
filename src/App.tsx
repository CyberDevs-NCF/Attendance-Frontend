import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/Dashboard";

// Types
interface User {
  email: string;
  name: string;
  role: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginErrors, setLoginErrors] = useState<LoginFormErrors>({});

  // Mock authentication
  const authenticateUser = async (email: string, password: string): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUsers = [
      { email: "admin@ncf.edu.ph", password: "admin123", name: "Jovanny", role: "admin" },
      { email: "faculty@ncf.edu.ph", password: "faculty123", name: "Faculty User", role: "faculty" },
      { email: "staff@ncf.edu.ph", password: "staff123", name: "Staff User", role: "staff" },
      { email: "dev@cyberdevs.org", password: "cyber123", name: "Cyber Developer", role: "developer" },
    ];

    const found = mockUsers.find((u) => u.email === email && u.password === password);
    return found ? { email: found.email, name: found.name, role: found.role } : null;
  };

  // Handle login
  const handleLogin = async (data: LoginFormData) => {
    setLoginLoading(true);
    setLoginErrors({});

    const errors: LoginFormErrors = {};
    if (!data.email) errors.email = "Email is required";
    if (!data.password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      setLoginLoading(false);
      return;
    }

    const authenticatedUser = await authenticateUser(data.email, data.password);

    if (authenticatedUser) {
      setIsAuthenticated(true);
      setUser(authenticatedUser);
    } else {
      setLoginErrors({
        email: "Invalid email or password",
        password: "Invalid email or password",
      });
    }

    setLoginLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Protected Route wrapper
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginForm onLogin={handleLogin} isLoading={loginLoading} errors={loginErrors} />
            )
          }
        />

        {/* Signup Page */}
        <Route path="/signup" element={<SignupForm />} />

        {/* Dashboard Page (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard user={user!} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
