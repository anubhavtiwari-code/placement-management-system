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
    <div className="p-6 grid grid-cols-2 gap-4">
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

