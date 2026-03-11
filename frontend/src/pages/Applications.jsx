import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

// Status Badge Utility
const STATUS_COLORS = {
  Applied:     "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Shortlisted: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Interview:   "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  Selected:    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Rejected:    "bg-red-500/10 text-red-400 border border-red-500/20",
};

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    api.get("/applications")
      .then(res => {
        setApplications(res.data.applications || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch applications");
        setLoading(false);
      });
  };

  const updateStatus = (id, status) => {
    api.put(`/applications/${id}/status`, { status })
      .then(() => {
        setApplications(prev =>
          prev.map(app =>
            app.id === id ? { ...app, status } : app
          )
        );
        toast.success(`Status updated to ${status}`);
      })
      .catch(err => {
        console.error("Update failed:", err.response?.data || err.message);
        toast.error("Failed to update status");
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in relative z-10">
      
      <div className="glass-panel p-6 sm:p-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">📄 Global Applications</h1>
          <p className="text-slate-400">Platform-wide overview of all submitted job applications.</p>
        </div>
        <div className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
          <span>{applications.length} Records</span>
        </div>
      </div>

      <div className="glass-panel p-6">
        {loading ? (
          <div className="text-center py-16 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            <span className="text-slate-400 animate-pulse">Loading tracking data...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-dashed border-slate-700">
             <p className="text-4xl mb-3">📭</p>
             <p className="text-lg font-medium text-slate-200 mb-1">No applications logged</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-700/50">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Tracking ID</th>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Target Company</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium text-right">Progress Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30 bg-slate-900/30">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">#{app.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-200">{app.student_name}</td>
                    <td className="px-6 py-4 text-brand-400">{app.company_name}</td>
                    <td className="px-6 py-4 text-slate-300">{app.job_title}</td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-md border text-center cursor-pointer outline-none focus:ring-2 focus:ring-brand-500/50 ${
                          STATUS_COLORS[app.status] || "bg-slate-800 text-slate-300 border-slate-700"
                        }`}
                      >
                        {["Applied", "Shortlisted", "Interview", "Selected", "Rejected"].map(
                          (s) => (
                            <option key={s} value={s} className="bg-slate-900 text-slate-200">
                              {s}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;
