import { NavLink } from "react-router-dom";
// import Login from "../pages/Login";

function Navbar() {

  const linkClass =({isActive}) =>
    isActive ? "text-blue-600 font-semibold"
    : "text-gray-700 hover:text-blue-600"
  ;
  return (

    <nav className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">
        placement Admin
      </h1>
      <div className="flex gap-6">

      
      <NavLink to="/dashboard/stats" className={linkClass}>Dashboard</NavLink> 
      <NavLink to="/students" className={linkClass}>Students</NavLink> 
      <NavLink to="/applications" className={linkClass}>Applications</NavLink> 
      <NavLink to="/job-drives" className={linkClass}>Job Drives</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
