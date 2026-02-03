import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  if (!token) {
    return (
      <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between">
        <h1 className="font-bold">Placement System</h1>
        <div className="space-x-4">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
    );
  }

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between">
      <h1 className="font-bold">Placement System</h1>
      <div className="space-x-4">
        {role === "student" && <Link to="/student">Student</Link>}
        {role === "company" && <Link to="/company">Company</Link>}
        {role === "admin" && <Link to="/admin">Admin</Link>}
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

