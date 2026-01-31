import { useEffect, useState } from "react";
import api from "../api/api";

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/job_drives").then(res => setJobs(res.data.job_drives));
  }, []);

  const applyJob = (jobId) => {
    api.post("/applications", { job_drive_id: jobId })
      .then(() => alert("Applied successfully"));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      {jobs.map(job => (
        <div key={job.id} className="border p-4 mb-3 rounded">
          <p className="font-semibold">{job.job_title}</p>
          <p>{job.company_name}</p>
          <button
            onClick={() => applyJob(job.id)}
            className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}

export default StudentDashboard;
