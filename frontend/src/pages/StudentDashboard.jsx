import { useEffect, useState } from "react";
import API from "../api/api";
import StudentApplications from "./StudentApplications";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});

  const fetchMyApplications = async () => {
    try {
      const res = await API.get("/applications");
      const ids = res.data.applications.map(app => app.job_drive_id);
      setAppliedJobIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    API.get("/job_drives")
      .then((res) => setJobs(res.data?.job_drives || []))
      .catch((err) => {
        console.error("Job Drives Fetch Error:", err);
        setJobs([]);
      });
    fetchMyApplications();
  }, []);

  const applyJob = async (jobId) => {
    setLoadingMap(prev => ({ ...prev, [jobId]: true }));
    try {
      await API.post("/student/apply", { job_drive_id: jobId });
      toast.success("Applied successfully!");
      fetchMyApplications(); 
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("You have already applied to this job.");
      } else {
        toast.error("Apply failed. Please try again.");
      }
    } finally {
      setLoadingMap(prev => ({ ...prev, [jobId]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Header section */}
      <div className="glass-panel p-6 sm:p-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">🎓 Student Portal</h1>
          <p className="text-slate-400">Manage your profile, view jobs, and track your applications.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Board */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            🚀 Available Drives
            <span className="text-sm font-normal px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
              {jobs.length} open
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {jobs.length === 0 ? (
              <p className="text-slate-400 col-span-full">No active drives at the moment.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="glass-card p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1 leading-tight">{job.job_title}</h3>
                    <p className="text-brand-400 text-sm font-medium mb-4 flex items-center gap-1.5">
                      🏢 {job.company_name}
                    </p>
                    <div className="text-sm text-slate-400 space-y-1 mb-6">
                      <p>✨ Min CGPA: <span className="text-slate-200">{job.min_cgpa}</span></p>
                    </div>
                  </div>

                  <button
                    onClick={() => applyJob(job.id)}
                    disabled={appliedJobIds.includes(job.id) || loadingMap[job.id]}
                    className={`w-full py-2.5 rounded-lg font-medium transition-all ${
                      appliedJobIds.includes(job.id)
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed"
                        : "btn-primary"
                    }`}
                  >
                    {loadingMap[job.id] ? "Applying..." : appliedJobIds.includes(job.id) ? "✓ Applied" : "Apply Now"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Applications tracking */}
        <div className="space-y-6">
           <StudentApplications />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
