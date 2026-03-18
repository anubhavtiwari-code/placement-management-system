import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cgpa: "",
    education: "",
    skills: "",
    experience: "",
    portfolio_url: "",
  });
  const [resumeFile, setResumeFile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/student/profile");
      const profileData = res.data.profile || res.data;
      if (profileData && profileData.name) {
        setProfile(profileData);
        setFormData({
          name: profileData.name || "",
          phone: profileData.phone || "",
          cgpa: profileData.cgpa || "",
          education: profileData.education || "",
          skills: profileData.skills || "",
          experience: profileData.experience || "",
          portfolio_url: profileData.portfolio_url || "",
        });
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (resumeFile) {
        data.append("resume", resumeFile);
      }

      await api.put("/student/profile", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setResumeFile(null);
      await fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center gap-3 text-slate-400 p-6 glass-panel mb-6">
      <div className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      <span className="text-sm font-medium">Loading profile...</span>
    </div>
  );
  
  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto py-4 animate-fade-in relative z-10 w-full text-slate-200">
      
      {!isEditing ? (
        // ==========================
        // DISPLAY READ-ONLY PROFILE
        // ==========================
        <div className="space-y-6">
          {/* Header Card */}
          <div className="glass-card p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-brand-400 to-indigo-600"></div>
            
            <div className="flex items-center gap-6 z-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-500/80 to-indigo-500/80 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl shrink-0">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {profile.email}
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {profile.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 z-10 w-full md:w-auto justify-center shadow-lg shadow-brand-500/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700/50 pb-4 mb-6">
                  <span className="text-xl">💼</span> Experience & Background
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-2">Education</h3>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {profile.education || <span className="text-slate-500 italic">No education details added yet.</span>}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-2">Work Experience</h3>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {profile.experience || <span className="text-slate-500 italic">No experience details added yet.</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 md:p-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700/50 pb-4 mb-6">
                  <span className="text-xl">🛠️</span> Core Skills
                </h2>
                {profile.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.split(',').map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm font-medium text-brand-300 shadow-sm">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No skills added yet.</p>
                )}
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              <div className="glass-card p-6 border-t-4 border-t-emerald-500">
                <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider mb-2">Academic Score</h3>
                <div className="flex items-end gap-2 text-emerald-400">
                  <span className="text-4xl font-bold leading-none">{Number(profile.cgpa).toFixed(2)}</span>
                  <span className="text-sm font-bold pb-1 text-emerald-500/70">CGPA</span>
                </div>
              </div>

              <div className="glass-card p-6 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-xl">📎</span> Attachments
                </h2>
                
                <div className="space-y-3">
                  {profile.resume_url ? (
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all group">
                      <div className="w-10 h-10 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-indigo-300">Resume attached</p>
                        <p className="text-xs text-indigo-400/60 truncate">View PDF Document</p>
                      </div>
                    </a>
                  ) : (
                    <div className="p-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/50 text-center">
                      <p className="text-slate-500 text-sm">No resume uploaded</p>
                    </div>
                  )}

                  {profile.portfolio_url && (
                    <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all">
                      <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-300">Portfolio / GitHub</p>
                        <p className="text-xs text-brand-400 truncate hover:underline">{profile.portfolio_url}</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (

        // ==========================
        // EDIT PROFILE FORM
        // ==========================
        <div className="glass-card p-6 md:p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-brand-400">✍️</span> Setup Your Profile
            </h2>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:border-brand-500 outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:border-brand-500 outline-none"
                  placeholder="e.g. 8.5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Portfolio / GitHub URL</label>
                <input
                  type="url"
                  name="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:border-brand-500 outline-none"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Education Background</label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:border-brand-500 outline-none resize-none"
                  placeholder="E.g., B.Tech in Computer Science from XYZ University (2020-2024)"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Core Skills (Comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:border-brand-500 outline-none"
                  placeholder="e.g. React, Node.js, Python, Data Structures"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Work & Project Experience</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:border-brand-500 outline-none resize-none"
                  placeholder="Describe any internships, notable projects, or achievements..."
                ></textarea>
              </div>

              {/* Resume Upload Box */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Upload Resume (PDF)</label>
                <div className="relative w-full rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 p-6 flex flex-col items-center justify-center hover:bg-slate-800/50 hover:border-brand-500 transition-colors cursor-pointer overflow-hidden group">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className={"w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-transform " + (resumeFile ? "bg-emerald-500/20 text-emerald-400 scale-110" : "bg-slate-800 text-brand-400 group-hover:scale-110 group-hover:bg-brand-500/10")}>
                      {resumeFile ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      )}
                    </div>
                    <p className="text-slate-200 font-medium z-0">
                      {resumeFile ? resumeFile.name : (profile.resume_url ? "Replace existing resume" : "Click or drag PDF to upload")}
                    </p>
                    <p className="text-slate-500 text-xs">Maximum file size: 5MB</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-slate-700/50 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className="btn-primary px-8 py-2.5 flex items-center justify-center min-w-[140px]"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
            
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
