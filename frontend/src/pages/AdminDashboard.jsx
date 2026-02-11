import { useEffect, useState } from "react";
import API from "../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/dashboard/stats")
      .then((res) => setStats(res.data.stats))
      .catch(() => alert("Failed to load stats"));
  }, []);

  if (!stats) return <p className="p-6">Loading...</p>;

  return (
   
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🛠️ Admin Dashboard</h1>
      <div className="mb-6">
  <h1 className="text-3xl font-bold text-gray-800">📊 Admin Overview</h1>
  <p className="text-gray-500 mt-1">Monitor platform performance and statistics</p>
</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

  {/* Total Students */}
  <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
    <p className="text-gray-500 text-sm">Total Students</p>
    <h2 className="text-3xl font-bold text-blue-600 mt-2">{stats.totalStudents}</h2>
  </div>

  {/* Total Companies */}
  <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-green-500 hover:shadow-lg transition">
    <p className="text-gray-500 text-sm">Total Companies</p>
    <h2 className="text-3xl font-bold text-green-600 mt-2">{stats.totalCompanies}</h2>
  </div>

  {/* Total Job Drives */}
  <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
    <p className="text-gray-500 text-sm">Total Job Drives</p>
    <h2 className="text-3xl font-bold text-purple-600 mt-2">{stats.totalJobDrives}</h2>
  </div>

  {/* Total Applications */}
  <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-orange-500 hover:shadow-lg transition">
    <p className="text-gray-500 text-sm">Total Applications</p>
    <h2 className="text-3xl font-bold text-orange-600 mt-2">{stats.totalApplications}</h2>
  </div>

  {/* Selected Students */}
  <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-red-500 hover:shadow-lg transition md:col-span-2">
    <p className="text-gray-500 text-sm">Total Selected Students</p>
    <h2 className="text-3xl font-bold text-red-600 mt-2">{stats.totalSelected}</h2>
  </div>

</div>

      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="bg-white p-4 shadow rounded">
          <h2 className="text-gray-500">{key.replaceAll("_", " ")}</h2>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;

