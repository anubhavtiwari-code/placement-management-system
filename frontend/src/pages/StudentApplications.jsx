import { useEffect, useState } from "react";
import api from "../api/api";

const STATUS_STYLES = {
  applied:     "bg-blue-100 text-blue-800",
  Applied:     "bg-blue-100 text-blue-800",
  Shortlisted: "bg-yellow-100 text-yellow-800",
  Interview:   "bg-purple-100 text-purple-800",
  Selected:    "bg-green-100 text-green-800",
  Rejected:    "bg-red-100 text-red-800",
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
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/applications");
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Applications fetch error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to load applications. Please try again.");
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
      <div className="flex items-center gap-2 text-gray-400 p-6">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading your applications...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📋 My Applications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track all your job applications in one place
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="text-sm text-blue-600 hover:underline"
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {!error && applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium text-gray-600">No applications yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Go to the Available Jobs section and apply to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.application_id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{app.job_title}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  🏢 {app.company_name || "—"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Applied on {new Date(app.applied_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </p>
              </div>

              <span
                className={`ml-4 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                  STATUS_STYLES[app.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {STATUS_LABEL[app.status] || app.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {applications.length > 0 && (
        <p className="text-xs text-gray-400 mt-4 text-right">
          {applications.length} application{applications.length > 1 ? "s" : ""} total
        </p>
      )}
    </div>
  );
};

export default StudentApplications;
