import { useEffect, useState } from "react";
import api from "../api/api";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications");
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading applications...</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">My Applications</h2>

      {applications.length === 0 ? (
        <p className="text-gray-500">You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app, index) => (
            <div
              key={index}
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
