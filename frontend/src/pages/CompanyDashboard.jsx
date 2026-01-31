import { useState } from "react";
import api from "../api/api";

function CompanyDashboard() {
  const [jobTitle, setJobTitle] = useState("");
  const [cgpa, setCgpa] = useState("");

  const createJob = () => {
    api.post("/job_drives", {
      job_title: jobTitle,
      min_cgpa: cgpa,
      drive_date: "2026-02-01",
    }).then(() => alert("Job created"));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Job Drive</h2>
      <input className="border p-2 mb-2 w-full"
        placeholder="Job Title"
        onChange={e => setJobTitle(e.target.value)}
      />
      <input className="border p-2 mb-2 w-full"
        placeholder="Min CGPA"
        onChange={e => setCgpa(e.target.value)}
      />
      <button
        onClick={createJob}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
}

export default CompanyDashboard;
