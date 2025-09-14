import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

interface LoginFormProps {
  onLogin?: (data: LoginFormData) => void;
  isLoading?: boolean;
  errors?: LoginFormErrors;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading = false,
  errors = {},
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" })); // clear error on typing
  };

  const handleSubmit = () => {
    if (!isLoading && formData.email && formData.password && onLogin) {
      const newErrors: LoginFormErrors = {};
      const allowedDomains = ["@gbox.ncf.edu.ph", "@ncf.edu.ph"];
      const isValidDomain = allowedDomains.some((domain) =>
        formData.email.toLowerCase().endsWith(domain)
      );

      if (!isValidDomain) {
        newErrors.email =
          "Email must end with @gbox.ncf.edu.ph or @ncf.edu.ph";
      }

      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
      }

      setFormErrors(newErrors);

      if (Object.keys(newErrors).length > 0) return;

      onLogin(formData);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-red-800 flex items-center justify-center p-4">
      {/* Header */}
      <Header />

      {/* Login Form */}
      <div className="w-full max-w-md">
        <div
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
          onKeyDown={handleKeyPress}
        >
          {/* Welcome Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome Officers!
            </h1>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-white text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Gbox email"
              className={`w-full px-4 py-3 rounded-lg bg-white/90 border ${
                formErrors.email || errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-gray-800 placeholder-gray-500`}
              disabled={isLoading}
            />
            {(formErrors.email || errors.email) && (
              <p className="text-red-400 text-sm mt-1">
                {formErrors.email || errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="text-white text-sm font-medium"
              >
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-blue-300 text-sm hover:text-blue-200 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full px-4 py-3 pr-12 rounded-lg bg-white/90 border ${
                  formErrors.password || errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-gray-800 placeholder-gray-500`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {(formErrors.password || errors.password) && (
              <p className="text-red-400 text-sm mt-1">
                {formErrors.password || errors.password}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !formData.email || !formData.password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <>
                <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </button>

          <hr className="border-white/20 my-6" />

          {/* Sign up link */}
          <div className="text-center mt-4">
            <p className="text-white text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={handleSignup}
                className="text-blue-300 hover:text-blue-200 font-semibold transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
