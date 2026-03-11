import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      toast.success("Login successful!");

      if (res.data.role === "student") navigate("/student");
      else if (res.data.role === "company") navigate("/company");
      else if (res.data.role === "admin") navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />

      <form
        onSubmit={handleLogin}
        className="glass-panel p-8 w-full max-w-sm animate-fade-in relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-sm text-slate-400">Log in to enter the Placement Portal</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="btn-primary w-full mt-8"
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>

        <p className="text-sm text-center mt-6 text-slate-400">
          New here?{" "}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
