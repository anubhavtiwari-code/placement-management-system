import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

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

    if (!form.name.trim()) return toast.error("Name is required.");
    if (!form.email.trim()) return toast.error("Email is required.");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters.");
    if (form.role === "student" && (!form.cgpa || isNaN(form.cgpa) || form.cgpa < 0 || form.cgpa > 10)) {
      return toast.error("Please enter a valid CGPA between 0 and 10.");
    }

    setLoading(true);
    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        cgpa: form.role === "student" ? form.cgpa : undefined,
      });
      toast.success("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />

      <form
        onSubmit={handleRegister}
        className="glass-panel p-8 w-full max-w-md animate-slide-up relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Create Account</h2>
          <p className="text-sm text-slate-400">Join the NexuxPlace ecosystem</p>
        </div>

        {/* Role selector first — drives which fields to show */}
        <div className="mb-5">
          <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "student" })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                form.role === "student" ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "company" })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                form.role === "company" ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              🏢 Company
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
              {form.role === "company" ? "Company Name" : "Full Name"}
            </label>
            <input
              type="text"
              placeholder={form.role === "company" ? "e.g. Google India" : "e.g. John Doe"}
              value={form.name}
              onChange={set("name")}
              className="input-field"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={set("email")}
              className="input-field"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={set("password")}
              className="input-field"
              required
            />
          </div>

          {/* CGPA — only for students */}
          {form.role === "student" && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">CGPA (0–10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="e.g. 8.5"
                value={form.cgpa}
                onChange={set("cgpa")}
                className="input-field"
                required
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-8"
        >
          {loading ? "Registering..." : "Create Account"}
        </button>

        <p className="text-sm text-center mt-6 text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
