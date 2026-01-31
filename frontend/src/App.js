import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Applications from "./pages/Applications";
import JobDrives from "./pages/JobDrives";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/dashboard/stats" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/job-drives" element={<JobDrives />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
