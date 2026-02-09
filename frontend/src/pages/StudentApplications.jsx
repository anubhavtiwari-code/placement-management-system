import { useEffect, useState } from "react";
import api from "../api/api";

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
      setError("Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading applications...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {applications.length === 0 ? (
        <p className="text-gray-500">
          You haven’t applied to any jobs yet.
        </p>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div
              key={app.application_id}
              className="border rounded-lg p-4 flex justify-between items-center bg-white"
            >
              <div>
                <p className="font-medium">{app.job_title}</p>
                <p className="text-sm text-gray-500">
                  {app.company_name}
                </p>
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

export default StudentApplications;
