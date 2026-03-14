import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/student/profile");
        // Support both {profile: {...}} and direct {...} formats
        const profileData = res.data.profile || res.data;
        if (profileData && profileData.name) {
          setProfile(profileData);
        } else {
          throw new Error("Invalid profile data");
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        toast.error("Failed to fetch profile details");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-3 text-slate-400 p-6 glass-panel mb-6">
      <div className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      <span className="text-sm font-medium">Loading profile...</span>
    </div>
  );
  
  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in relative z-10">
      <div className="glass-panel p-6 sm:p-8">
        <h2 className="text-xl font-heading font-bold text-white mb-6 pb-4 border-b border-slate-700/50 flex items-center gap-2">
          <span className="text-brand-400">👤</span> My Profile Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Full Name</p>
            <p className="text-lg font-semibold text-slate-200">{profile.name}</p>
          </div>
          
          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Registered Email</p>
            <p className="text-lg font-semibold text-slate-200 truncate">{profile.email}</p>
          </div>
          
          <div className="bg-slate-900/40 p-5 rounded-xl border border-brand-500/30">
            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Academic Score</p>
            <div className="flex items-end gap-2 text-brand-400">
              <span className="text-2xl font-bold leading-none">{Number(profile.cgpa).toFixed(2)}</span>
              <span className="text-sm font-medium pb-1">CGPA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
