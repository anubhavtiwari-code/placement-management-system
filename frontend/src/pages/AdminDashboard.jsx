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
  const data = [
    { value: Math.max(0, safeValue - 5) },
    { value: Math.max(0, safeValue - 3) },
    { value: Math.max(0, safeValue - 4) },
    { value: Math.max(0, safeValue - 1) },
    { value: safeValue },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`glass-card p-6 overflow-hidden relative group`}
    >
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 ${colorClass}`} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h2 className="text-4xl font-heading font-bold text-white">{safeValue}</h2>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-900/50 border border-slate-700/50">
          {icon}
        </div>
      </div>
      <div className="w-full h-[60px] relative z-10 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              labelStyle={{ display: 'none' }}
            />
            <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={3} dot={{ r: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

/* ---------- Dashboard ---------- */

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [tab, setTab] = useState("stats"); // stats | verification | reports
  const [loading, setLoading] = useState(true);

  const loadStats = () => {
    API.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => toast.error("Failed to load statistics"));
  };

  const loadCompanies = () => {
    API.get("/admin/companies")
      .then((res) => setCompanies(res.data))
      .catch(() => toast.error("Failed to load companies"));
  };

  useEffect(() => {
    loadStats();
    loadCompanies();
    setLoading(false);
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await API.patch(`/admin/companies/${id}`, { status });
      toast.success(`Company ${status}!`);
      loadCompanies();
    } catch {
      toast.error("Verification failed");
    }
  };

  const exportReport = async () => {
    try {
      const res = await API.get("/admin/export-data");
      const data = res.data;
      if (data.length === 0) return toast.error("No data to export");

      const headers = Object.keys(data[0]).join(",");
      const rows = data.map(obj => Object.values(obj).join(",")).join("\n");
      const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `placement_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success("Report downloaded");
    } catch {
      toast.error("Export failed");
    }
  };

  if (loading || !stats) return <div className="p-20 text-center text-slate-400">Loading Central Console...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in relative z-10">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
          <span className="text-3xl">🛠️</span>
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-1">Central Console</h1>
          <p className="text-slate-400">Platform-wide management and analytics.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700/50 pb-px">
        {["stats", "verification", "reports"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-all ${
              tab === t ? "border-brand-500 text-brand-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {tab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Students" value={stats.total_students} colorClass="bg-blue-500" lineColor="#3b82f6" icon="🎓" />
            <StatCard title="Total Companies" value={stats.total_companies} colorClass="bg-purple-500" lineColor="#a855f7" icon="🏢" />
            <StatCard title="Job Drives" value={stats.total_job_drives || stats.total_jobs} colorClass="bg-brand-500" lineColor="#0ea5e9" icon="🚀" />
            <StatCard title="Applications" value={stats.total_applications} colorClass="bg-orange-500" lineColor="#f97316" icon="📄" />
            <StatCard title="Selected" value={stats.total_selected_students} colorClass="bg-emerald-500" lineColor="#10b981" icon="🏆" />
          </div>
        )}

        {tab === "verification" && (
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="px-6 py-4">Company Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {companies.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                    <td className="px-6 py-4 text-slate-400">{c.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        c.verification_status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 
                        c.verification_status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {c.verification_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       {c.verification_status !== 'approved' && (
                         <button onClick={() => handleVerify(c.id, 'approved')} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded hover:bg-emerald-500/20">Approve</button>
                       )}
                       {c.verification_status !== 'rejected' && (
                         <button onClick={() => handleVerify(c.id, 'rejected')} className="text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/20">Reject</button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "reports" && (
          <div className="glass-panel p-8 space-y-6 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-2">Export Data</h3>
              <p className="text-slate-400 mb-6 text-sm">Download a comprehensive CSV report containing all students, companies, and their application statuses.</p>
              <button onClick={exportReport} className="btn-primary px-10 py-3">
                📥 Download Placement Report (CSV)
              </button>
            </div>
            
            <div className="border-t border-slate-700/50 pt-8 mt-8">
               <h3 className="text-xl font-bold text-white mb-2">Bulk Student Import</h3>
               <p className="text-slate-400 text-sm mb-4">Paste student JSON data to onboard multiple students at once.</p>
               <textarea 
                  className="input-field h-32 mb-4 font-mono text-xs" 
                  placeholder='[{"name": "John", "email": "john@ex.com", "cgpa": 8.5, "user_id": 10}]'
                  id="bulk-input"
               />
               <button 
                  onClick={async () => {
                    try {
                      const data = JSON.parse(document.getElementById('bulk-input').value);
                      await API.post("/admin/bulk-students", { students: data });
                      toast.success("Imported!");
                    } catch { toast.error("Invalid JSON or import failed"); }
                  }}
                  className="btn-outline px-10"
                >
                  Confirm Bulk Import
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;