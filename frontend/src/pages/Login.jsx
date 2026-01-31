import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "student") navigate("/student");
      if (res.data.role === "company") navigate("/company");
      if (res.data.role === "admin") navigate("/");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="border p-6 rounded w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input className="border p-2 w-full mb-3"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <button className="bg-blue-600 text-white w-full p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
