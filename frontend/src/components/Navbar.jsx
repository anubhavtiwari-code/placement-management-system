import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-brand-500/10 text-brand-400"
            : "text-slate-300 hover:bg-white/5 hover:text-white"
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand / Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-brand-500/50 transition-all">
                P
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                Nexus<span className="text-brand-400">Place</span>
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!token ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm transition-colors px-3">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 text-sm scale-95 hover:scale-100 hidden sm:inline-flex">
                  Get Started
                </Link>
              </div>
            ) : (
              <>
                <div className="hidden md:flex space-x-1 mr-4">
                  {role === "student" && <NavLink to="/student">Dashboard</NavLink>}
                  {role === "company" && <NavLink to="/company">Dashboard</NavLink>}
                  {role === "admin" && <NavLink to="/admin">Dashboard</NavLink>}
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-slate-800 hover:bg-red-500/20 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
