import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

/* ---------- Safe Reusable Card ---------- */
const StatCard = ({ title, value, borderColor, lineColor }) => {

  const safeValue = Number(value) || 0;

  const data = [
    { value: safeValue - 4 },
    { value: safeValue - 3 },
    { value: safeValue - 2 },
    { value: safeValue - 1 },
    { value: safeValue },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className={`bg-white shadow-md rounded-xl p-6 border-l-4 ${borderColor}`}
    >
      <p className="text-gray-500 text-sm">{title}</p>

      {/* Number */}
      <h2 className="text-3xl font-bold mt-2 mb-4">
        {safeValue}
      </h2>

      {/* Mini Chart */}
      <div style={{ width: "100%", height: 70 }}>
  <ResponsiveContainer width="100%" height={70}>
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

/* ---------- Dashboard ---------- */

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/dashboard/stats")
      .then((res) => {
        console.log("API DATA:", res.data); // 👈 check this
        setStats(res.data.stats);
      })
      .catch(() => alert("Failed to load stats"));
  }, []);

  if (!stats) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-2">🛠️ Admin Dashboard</h1>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          📊 Admin Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor platform performance and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <StatCard
  title="Total Students"
  value={stats.total_students}
  borderColor="border-blue-500"
  lineColor="#3b82f6"
/>

<StatCard
  title="Total Companies"
  value={stats.total_companies}
  borderColor="border-green-500"
  lineColor="#22c55e"
/>

<StatCard
  title="Total Job Drives"
  value={stats.total_job_drives}
  borderColor="border-purple-500"
  lineColor="#a855f7"
/>

<StatCard
  title="Total Applications"
  value={stats.total_applications}
  borderColor="border-orange-500"
  lineColor="#f97316"
/>

      <StatCard
  title="Total Selected Students"
  value={stats.total_selected_students}
  borderColor="border-red-500"
  lineColor="#ef4444"
       />
        </div>

      </div>
 
  );
};

export default AdminDashboard;