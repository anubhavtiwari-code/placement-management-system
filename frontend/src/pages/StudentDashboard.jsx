import { useEffect, useState } from "react";
import API from "../api/api";
import MyApplications from "./MyApplications";
import StudentProfile from "../components/StudentProfile";
const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
const [appliedJobIds, setAppliedJobIds] = useState([]);

  // useEffect(() => {
  //   API.get("/job_drives").then((res) => setJobs(res.data.job_drives));
  // }, []);
 const fetchMyApplications = async () => {
  try {
    const res = await API.get("/applications");
    // extract job IDs only
    const ids = res.data.applications.map(app => app.job_drive_id);
    setAppliedJobIds(ids);
  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  API.get("/job_drives").then((res) => setJobs(res.data.job_drives));
  fetchMyApplications();
}, []);

 const applyJob = async (jobId) => {
  try {
    await API.post("/student/apply", {
      job_drive_id: jobId,
    });

    alert("Applied successfully");
    fetchMyApplications(); // refresh My Applications
  } catch (err) {
    if (err.response?.status === 409) {
      alert("You have already applied to this job");
    } else {
      alert("Apply failed. Please try again.");
    }
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🎓 Student Dashboard</h1>
                  <StudentProfile />
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
         <MyApplications />

      {jobs.map((job) => (
        <div key={job.id} className="border p-4 mb-3 rounded">
          <h2 className="font-bold">{job.job_title}</h2>
          <p>Company: {job.company_name}</p>
          <p>Min CGPA: {job.min_cgpa}</p>

          <button
            onClick={() => applyJob(job.id)}
            disabled={appliedJobIds.includes(job.id)}
             className={`mt-2 px-4 py-1 rounded text-white ${
    appliedJobIds.includes(job.id)
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600"
  }`}
>
         {appliedJobIds.includes(job.id) ? "Applied" : "Apply"}
         
</button>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboard;
