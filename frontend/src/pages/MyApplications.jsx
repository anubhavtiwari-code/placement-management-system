import { useEffect, useState, useCallback } from "react";
import api from "../api/api";

const MyApplications = ({ refresh }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications");
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // refresh triggered by parent
  useEffect(() => {
    if (refresh) fetchApplications();
  }, [refresh, fetchApplications]);

  if (loading) {
    return <p className="text-gray-500">Loading applications...</p>;
  }

  // filter by status
  const filteredApplications = applications.filter(app => {
    if (filter === "ALL") return true;
    return app.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">My Applications</h2>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {["ALL", "Applied", "Selected", "Rejected"].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 text-sm rounded ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredApplications.length === 0 ? (
        <p className="text-gray-500">You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map(app => (
            <div
              key={app.application_id}
              className="border rounded-lg p-4 flex justify-between items-center bg-white"
            >
              <div>
                <p className="font-medium">{app.job_title}</p>
                <p className="text-sm text-gray-500">{app.company_name}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    app.status === "Selected"
                      ? "bg-green-100 text-green-700"
                      : app.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }
                `}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
