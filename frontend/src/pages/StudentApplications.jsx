import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  applied:     "bg-blue-500/10 border-blue-500/20 text-blue-400",
  Applied:     "bg-blue-500/10 border-blue-500/20 text-blue-400",
  Shortlisted: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  Interview:   "bg-purple-500/10 border-purple-500/20 text-purple-400",
  Selected:    "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  Rejected:    "bg-red-500/10 border-red-500/20 text-red-400",
};

const STATUS_LABEL = {
  applied:     "Applied",
  Applied:     "Applied",
  Shortlisted: "Shortlisted",
  Interview:   "Interview Scheduled",
  Selected:    "🎉 Selected",
  Rejected:    "Rejected",
};

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications");
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Applications fetch error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to load applications. Please try again.");
      }
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-slate-400 p-6 glass-panel">
        <svg className="animate-spin h-5 w-5 text-brand-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="text-sm font-medium">Syncing applications...</span>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 flex flex-col h-full min-h-[500px]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">📋 My Trackers</h2>
        </div>
        <button
          onClick={fetchApplications}
          className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors bg-brand-500/10 px-3 py-1.5 rounded-md"
        >
          ↻ Refresh
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 flex-1 flex flex-col items-center justify-center opacity-70">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium text-slate-300">No applications yet</p>
          <p className="text-sm text-slate-500 mt-1 max-w-[200px]">
            Click "Apply" on the left to start your journey!
          </p>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {applications.map((app) => (
            <div
              key={app.application_id}
              className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-200 truncate">{app.job_title}</p>
                <p className="text-sm text-brand-400/80 mt-0.5 font-medium">
                  🏢 {app.company_name || "—"}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-md text-xs font-medium border whitespace-nowrap text-center ${
                  STATUS_STYLES[app.status] || "bg-slate-700/50 border-slate-600 text-slate-300"
                }`}
              >
                {STATUS_LABEL[app.status] || app.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {applications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
           <p className="text-xs text-slate-500 text-center font-medium">
            Active tracking for {applications.length} drive{applications.length > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
