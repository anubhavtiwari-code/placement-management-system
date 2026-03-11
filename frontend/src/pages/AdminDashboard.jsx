import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip
} from "recharts";

/* ---------- Safe Reusable Card ---------- */
const StatCard = ({ title, value, colorClass, lineColor, icon }) => {
  const safeValue = Number(value) || 0;

  // Generate some subtle dummy data for the sparkline chart
  const data = [
    { value: Math.max(0, safeValue - Math.floor(Math.random() * 5)) },
    { value: Math.max(0, safeValue - Math.floor(Math.random() * 4)) },
    { value: Math.max(0, safeValue - Math.floor(Math.random() * 3)) },
    { value: Math.max(0, safeValue - Math.floor(Math.random() * 2)) },
    { value: safeValue },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-6 overflow-hidden relative group`}
    >
      {/* Background glow specific to the card color */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity ${colorClass}`} />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h2 className="text-4xl font-heading font-bold text-white">
            {safeValue}
          </h2>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-900/50 border border-slate-700/50 shadow-inner`}>
          {icon}
        </div>
      </div>

      {/* Mini Chart */}
      <div className="w-full h-[60px] relative z-10 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: lineColor }}
              cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '3 3' }}
              labelStyle={{ display: 'none' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 4, fill: lineColor, stroke: '#0f172a', strokeWidth: 2 }}
              animationDuration={1500}
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
        setStats(res.data.stats);
      })
      .catch(() => toast.error("Failed to load platform statistics"));
  }, []);

  if (!stats) return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium">Aggregating platform metrics...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in relative z-10">

      {/* Header section */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
          <span className="text-3xl">🛠️</span>
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-1">Central Console</h1>
          <p className="text-slate-400">Real-time overview of the NexusPlace ecosystem.</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <StatCard
          title="Total Students"
          value={stats.total_students}
          colorClass="bg-blue-500"
          lineColor="#3b82f6"
          icon="🎓"
        />

        <StatCard
          title="Total Companies"
          value={stats.total_companies}
          colorClass="bg-purple-500"
          lineColor="#a855f7"
          icon="🏢"
        />

        <StatCard
          title="Active Job Drives"
          value={stats.total_job_drives}
          colorClass="bg-brand-500"
          lineColor="#0ea5e9"
          icon="🚀"
        />

        <StatCard
          title="Total Applications"
          value={stats.total_applications}
          colorClass="bg-orange-500"
          lineColor="#f97316"
          icon="📄"
        />

        <StatCard
          title="Selected Candidates"
          value={stats.total_selected_students}
          colorClass="bg-emerald-500"
          lineColor="#10b981"
          icon="🏆"
        />
      </div>

    </div>
  );
};

export default AdminDashboard;