import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">placement Admin</h1>

      <div className="flex gap-6 items-center">
        {token ? (
          <>
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/students">Students</NavLink>
            <NavLink to="/applications">Applications</NavLink>
            <NavLink to="/job-drives">Job Drives</NavLink>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="text-blue-600 font-semibold">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
