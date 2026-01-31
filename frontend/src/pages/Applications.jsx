import { useEffect, useState } from "react";
import api from "../api/api";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    api.get("/applications")
      .then(res => {
        setApplications(res.data.applications);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
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
      })
      .catch(err => {
        console.error("Update failed:", err.response?.data || err.message);
        alert("Failed to update status");
      });
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Applications</h2>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Company</th>
            <th>Job</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.student_name}</td>
              <td>{app.company_name}</td>
              <td>{app.job_title}</td>
              <td>
                <select
                className="border rounded px-2 py-1 bg-white"
                  value={app.status}
                  onChange={(e) =>
                    updateStatus(app.id, e.target.value)
                  }
                >
                  <option>Applied</option>
                  <option>Shortlisted</option>
                  <option>Interview</option>
                  <option>Selected</option>
                  <option>Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Applications;
