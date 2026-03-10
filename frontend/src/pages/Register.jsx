import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    cgpa: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return alert("Name is required.");
    if (!form.email.trim()) return alert("Email is required.");
    if (form.password.length < 6) return alert("Password must be at least 6 characters.");
    if (form.role === "student" && (!form.cgpa || isNaN(form.cgpa) || form.cgpa < 0 || form.cgpa > 10))
      return alert("Please enter a valid CGPA between 0 and 10.");

    setLoading(true);
    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        cgpa: form.role === "student" ? form.cgpa : undefined,
      });
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-1 text-gray-800">Create Account</h2>
        <p className="text-sm text-gray-400 mb-6">Join the Placement Portal</p>

        {/* Role selector first — drives which fields to show */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">I am a</label>
          <select
            value={form.role}
            onChange={set("role")}
            className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="student">🎓 Student</option>
            <option value="company">🏢 Company</option>
          </select>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {form.role === "company" ? "Company Name" : "Full Name"}
          </label>
          <input
            type="text"
            placeholder={form.role === "company" ? "e.g. Google India" : "e.g. Anubhav Tiwari"}
            value={form.name}
            onChange={set("name")}
            className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={set("email")}
            className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={set("password")}
            className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* CGPA — only for students */}
        {form.role === "student" && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">CGPA (0–10)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g. 8.5"
              value={form.cgpa}
              onChange={set("cgpa")}
              className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white w-full py-2.5 rounded-lg font-medium transition-colors mt-2"
        >
          {loading ? "Registering..." : "Create Account"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
