import { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats")
      .then(res => setStats(res.data.stats))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-blue-100 p-4 rounded shadow">
        <p className="text-sm text-gray-600">Students</p>
        <p className="text-2xl font-bold">{stats.total_students}</p>
      </div>

      <div className="bg-green-100 p-4 rounded shadow">
        <p className="text-sm text-gray-600">Companies</p>
        <p className="text-2xl font-bold">{stats.total_companies}</p>
      </div>

      <div className="bg-yellow-100 p-4 rounded shadow">
        <p className="text-sm text-gray-600">Job Drives</p>
        <p className="text-2xl font-bold">{stats.total_job_drives}</p>
      </div>

      <div className="bg-purple-100 p-4 rounded shadow">
        <p className="text-sm text-gray-600">Applications</p>
        <p className="text-2xl font-bold">{stats.total_applications}</p>
      </div>

      <div className="bg-red-100 p-4 rounded shadow">
        <p className="text-sm text-gray-600">Selected</p>
        <p className="text-2xl font-bold">{stats.total_selected_students}</p>
      </div>
    </div>
  </div>
);
}
export default Dashboard;
