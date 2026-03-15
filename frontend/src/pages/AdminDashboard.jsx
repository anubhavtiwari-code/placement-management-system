import { useEffect, useState, useRef } from "react";
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
      <div className="h-[60px] w-full mt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              labelStyle={{ display: 'none' }}
              cursor={{ stroke: lineColor, strokeWidth: 1 }}
            />
            <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={3} dot={false} isAnimationActive={false} />
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
  const [refreshing, setRefreshing] = useState(false);
  const fetchRef = useRef(false);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    // Fetch stats first for immediate display (with cache busting & timeout)
    try {
      const statsRes = await API.get(`/admin/stats?cb=${Date.now()}`);
      console.log("🔍 Stats Raw Data:", statsRes.data);
      
      // Ensure we have at least total_students to consider it "loaded"
      if (statsRes.data && (statsRes.data.total_students !== undefined)) {
        setStats(statsRes.data);
        console.log("📈 Production Stats Sync Successful");
      } else {
        throw new Error("Invalid stats format received");
      }
      setLoading(false); // Move past loading screen if we have a valid response
    } catch (err) {
      console.error("Stats sync error:", err);
      toast.error("Statistics failed to load. Please refresh.");
      setLoading(false); // Still move past loader to allow access to other tabs
    }

    // Fetch companies separately
    try {
      const companiesRes = await API.get("/admin/companies");
      setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
    } catch (err) {
      console.error("Companies fetch error:", err);
      // Don't toast here to avoid spamming the user if verification isn't critical
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (fetchRef.current) return;
    fetchRef.current = true;
    loadData();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await API.patch(`/admin/companies/${id}`, { status });
      toast.success(`Company ${status}!`);
      loadData();
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

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 space-y-4">
      <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      <p className="font-heading animate-pulse text-brand-400">Synchronizing Production Environment (v1.2)...</p>
    </div>
  );

  if (!stats) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 space-y-4">
      <p className="text-xl font-bold text-white">⚠️ Cloud Sync Interrupted</p>
      <div className="text-center text-slate-500 text-sm max-w-md bg-slate-900/50 p-4 rounded-lg border border-slate-800">
        <p>The dashboard is having trouble communicating with the platform metrics engine. This usually happens during database cold starts.</p>
        <p className="mt-2 text-brand-500/70 font-mono">System ID: v1.2.5-Stable</p>
      </div>
      <div className="flex gap-4 mt-4">
        <button onClick={() => window.location.reload()} className="btn-primary">Retry Sync</button>
        <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all">Clear Session</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in relative z-10">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
            <span className="text-3xl">🛠️</span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-heading font-bold text-white mb-1">Central Console</h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-slate-400">Platform-wide management and real-time analytics.</p>
          </div>
        </div>
        
        <button 
          onClick={() => loadData(true)} 
          disabled={refreshing}
          className="btn-outline px-4 py-2 text-sm flex items-center gap-2 group"
        >
          <span className={`${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>🔄</span>
          {refreshing ? 'Syncing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900/40 p-1 rounded-xl border border-slate-800 w-fit">
        {["stats", "verification", "reports"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t 
                ? "bg-brand-600 text-white shadow-lg" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div 
        key={tab}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
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
          <div className="glass-panel overflow-hidden border-slate-800/50">
            {companies.length > 0 ? (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-800/50 text-slate-300">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Company Name</th>
                    <th className="px-6 py-4 font-semibold">Email Domain</th>
                    <th className="px-6 py-4 font-semibold">Verification Status</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {companies.map(c => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{c.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          c.verification_status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          c.verification_status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {c.verification_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                         {c.verification_status !== 'approved' && (
                           <button 
                             onClick={() => handleVerify(c.id, 'approved')} 
                             className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-all font-medium"
                           >
                            Approve
                           </button>
                         )}
                         {c.verification_status !== 'rejected' && (
                           <button 
                             onClick={() => handleVerify(c.id, 'rejected')} 
                             className="text-[11px] bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-all font-medium"
                           >
                            Reject
                           </button>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center space-y-3">
                <div className="text-4xl opacity-20">🏢</div>
                <p className="text-slate-500 font-medium">No company records found for verification.</p>
              </div>
            )}
          </div>
        )}

        {tab === "reports" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 flex flex-col items-center text-center justify-center">
              <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-500/20">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Export Data</h3>
              <p className="text-slate-400 mb-8 text-sm max-w-xs">Download a structured CSV report containing students, companies, and application insights.</p>
              <button onClick={exportReport} className="btn-primary w-full max-w-xs py-3">
                📥 Download Placement Report
              </button>
            </div>
            
            <div className="glass-panel p-8 flex flex-col h-full">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 text-xl">🚀</div>
                 <div>
                   <h3 className="text-lg font-bold text-white">Bulk Student Import</h3>
                   <p className="text-slate-400 text-xs">Onboard multiple students via JSON</p>
                 </div>
               </div>
               
               <textarea 
                  className="input-field h-40 mb-4 font-mono text-[11px] resize-none" 
                  placeholder='[{"name": "John Doe", "email": "john@university.edu", "cgpa": 8.5, "user_id": 101}]'
                  id="bulk-input"
               />
               
               <button 
                  onClick={async () => {
                    const el = document.getElementById('bulk-input');
                    try {
                      const data = JSON.parse(el.value);
                      await API.post("/admin/bulk-students", { students: data });
                      toast.success("Batch import successful");
                      el.value = "";
                      loadData();
                    } catch { 
                      toast.error("Format error: Ensure data is a valid JSON array"); 
                    }
                  }}
                  className="btn-outline w-full py-3"
                >
                  Confirm Batch Import
                </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};


export default AdminDashboard;