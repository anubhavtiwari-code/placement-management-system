import { useEffect, useState } from "react";
import API from "../api/api";
import StudentApplications from "./StudentApplications";
import StudentProfile from "../components/StudentProfile";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const [activeTab, setActiveTab] = useState("jobs"); // "jobs" | "profile"

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
      
      {/* Header section with Tabs */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">🎓 Student Portal</h1>
          <p className="text-slate-400">Manage your profile, view jobs, and track your applications.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-slate-700/50 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "jobs" ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            Available Jobs
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "profile" ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            My Profile
          </button>
        </div>
      </div>

      {activeTab === "profile" ? (
        <StudentProfile />
      ) : (
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
                    <div className="text-sm text-slate-400 space-y-3 mb-6 border-t border-slate-700/50 pt-3">
                      <div className="flex justify-between items-center">
                        <p>✨ Min CGPA: <span className="text-slate-200">{job.min_cgpa}</span></p>
                      </div>
                      
                      {job.match_score !== undefined && (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5 text-indigo-400">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                              ATSkill Match Pulse
                            </span>
                            <span className={job.match_score >= 70 ? "text-emerald-400" : job.match_score >= 40 ? "text-yellow-400" : "text-red-400"}>
                              {job.match_score}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${job.match_score >= 70 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : job.match_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${job.match_score}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
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
      )}
    </div>
  );
};

export default StudentDashboard;
