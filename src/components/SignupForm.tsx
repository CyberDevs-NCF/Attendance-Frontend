import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import AuthBackground from "./AuthBackground";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
}

const SignupForm: React.FC = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // clear error on typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    const allowedDomains = ["@gbox.ncf.edu.ph", "@ncf.edu.ph"];

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !allowedDomains.some((domain) =>
        form.email.toLowerCase().endsWith(domain)
      )
    ) {
      newErrors.email = "Email must end with @gbox.ncf.edu.ph or @ncf.edu.ph";
    }
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setFormErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      setSuccessMessage("Signup successful! 🎉");
      setIsLoading(false);
      // setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setSuccessMessage("");
      setFormErrors({ email: "Signup failed. Please try again." });
    }
  };

  return (
    <AuthBackground>
      <Header />

      {/* Signup Form */}
      <div className="w-full max-w-md my-5 flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl w-full">
          {/* Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Create an Account
            </h1>
            <p className="text-gray-200 text-sm">Join us and get started!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-white text-sm font-medium mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full px-4 py-3 rounded-lg bg-white/90 border ${
                  formErrors.fullName
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 placeholder-gray-500 transition-all duration-300 shadow-xl/30`}
                disabled={isLoading}
              />
              {formErrors.fullName && (
                <p className="text-red-400 text-sm mt-1">
                  {formErrors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
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
                value={form.email}
                onChange={handleChange}
                placeholder="Gbox email"
                className={`w-full px-4 py-3 rounded-lg bg-white/90 border ${
                  formErrors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 placeholder-gray-500 transition-all duration-300 shadow-xl/30`}
                disabled={isLoading}
              />
              {formErrors.email && (
                <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-white text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full px-4 py-3 pr-12 rounded-lg bg-white/90 border ${
                    formErrors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 placeholder-gray-500 transition-all duration-300 shadow-xl/30`}
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
              {formErrors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={
                isLoading || !form.fullName || !form.email || !form.password
              }
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Success + QR preview */}
          {successMessage && (
            <p className="text-green-400 text-sm mt-4 text-center">
              {successMessage}
            </p>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6">
            <p className="text-white text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-blue-300 hover:text-blue-200 font-semibold transition-colors cursor-pointer"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
};

export default SignupForm;
