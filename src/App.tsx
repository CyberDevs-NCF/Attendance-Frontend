import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/Dashboard";
import axios from "axios";

// Types
interface User {
  email: string;
  fullName: string;
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login
  const handleLogin = async (data: LoginFormData) => {
    console.log("Login data received in App:", data);
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

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        data,
        {
          headers: {
            "Content-Type": "application/json", // use json instead of x-www-form-urlencoded unless your backend requires it
          },
        }
      );

      setIsAuthenticated(true);
      setUser({ email: res.data.email, fullName: res.data.fullName });
      // ✅ set user object
      console.log("Login successful", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("fullName", res.data.fullName);
    } catch (error) {
      setLoginErrors({
        email: "Invalid email or password",
        password: "Invalid email or password",
      });
      console.error("Login failed", error);
    }

    setLoginLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Protected Route wrapper
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
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
              <LoginForm
                onLogin={handleLogin}
                isLoading={loginLoading}
                errors={loginErrors}
              />
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
              <Dashboard
                email={user?.email || localStorage.getItem("email") || "n/a"}
                fullName={
                  user?.fullName || localStorage.getItem("fullName") || "n/a"
                }
                onLogout={handleLogout}
              />
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
