import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

    return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Placement System</h1>

      <div className="flex gap-4 items-center">
        {role === "admin" && (
          <>
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/students">Students</NavLink>
          </>
        )}
                  <>
  <NavLink to="/login">Login</NavLink>
  <NavLink to="/register">Register</NavLink>
</>

        {role === "student" && (
          <NavLink to="/student">My Dashboard</NavLink>
        )}

        {role === "company" && (
          <NavLink to="/company">Company Dashboard</NavLink>
        )}

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
