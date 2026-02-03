import { useEffect, useState } from "react";
import API from "../api/api";

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/job_drives").then((res) => setJobs(res.data.job_drives));
  }, []);

  const applyJob = async (jobId) => {
    try {
      await API.post("/student/apply", {
        job_drive_id: jobId,
      });
      alert("Applied successfully");
    } catch {
      alert("Apply failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>

      {jobs.map((job) => (
        <div key={job.id} className="border p-4 mb-3 rounded">
          <h2 className="font-bold">{job.job_title}</h2>
          <p>Company: {job.company_name}</p>
          <p>Min CGPA: {job.min_cgpa}</p>

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
};

export default StudentDashboard;
