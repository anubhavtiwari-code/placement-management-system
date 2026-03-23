import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

// ── Status badge colors ──────────────────────────────────────────────────────
const STATUS_COLORS = {
  Applied:    "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Shortlisted:"bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Interview:  "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  Selected:   "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Rejected:   "bg-red-500/10 text-red-400 border border-red-500/20",
};

const Badge = ({ label, colorClass }) => (
  <span className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${colorClass}`}>
    {label}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
const CompanyDashboard = () => {
  // ── drives section ──
  const [drives, setDrives] = useState([]);
  const [drivesLoading, setDrivesLoading] = useState(true);

  // ── applicants section ──
  const [applicants, setApplicants] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [cgpaFilter, setCgpaFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]); // NEW: for batch actions

  // ── form (create / edit) ──
  const [form, setForm] = useState({ job_title: "", min_cgpa: "", description: "", drive_date: "" });
  const [editingId, setEditingId] = useState(null); // null = create mode
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── active tab ──
  const [tab, setTab] = useState("drives"); // "drives" | "applicants"

  // ── load data ────────────────────────────────────────────────────────────
  const loadDrives = () => {
    setDrivesLoading(true);
    API.get("/company/job_drives")
      .then((r) => setDrives(r.data.drives || []))
      .catch(() => toast.error("Failed to load drives"))
      .finally(() => setDrivesLoading(false));
  };

  const loadApplicants = () => {
    setAppsLoading(true);
    API.get("/company/applicants")
      .then((r) => setApplicants(r.data.applicants || []))
      .catch(() => toast.error("Failed to load applicants"))
      .finally(() => {
        setAppsLoading(false);
        setSelectedIds([]); 
      });
  };

  useEffect(() => {
    loadDrives();
    loadApplicants();
  }, []);

  // ── create / edit job ─────────────────────────────────────────────────────
  const openCreateForm = () => {
    setEditingId(null);
    setForm({ job_title: "", min_cgpa: "", description: "", drive_date: "" });
    setFormOpen(true);
  };

  const openEditForm = (drive) => {
    setEditingId(drive.id);
    setForm({
      job_title:   drive.job_title,
      min_cgpa:    drive.min_cgpa,
      description: drive.description || "",
      drive_date:  drive.drive_date ? drive.drive_date.substring(0, 10) : "",
    });
    setFormOpen(true);
  };

  const saveJob = async () => {
    if (!form.job_title || !form.min_cgpa) {
      return toast.error("Job Title and Min CGPA are required.");
    }
    setSaving(true);
    try {
      if (editingId) {
        await API.put(`/company/job_drives/${editingId}`, form);
        toast.success("Drive updated successfully");
      } else {
        await API.post("/company/job_drives", form);
        toast.success("Drive created successfully");
      }
      setFormOpen(false);
      loadDrives();
    } catch {
      toast.error("Failed to save job drive.");
    } finally {
      setSaving(false);
    }
  };

  // ── delete job ────────────────────────────────────────────────────────────
  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job drive? All applications will also be removed.")) return;
    try {
      await API.delete(`/company/job_drives/${id}`);
      setDrives((prev) => prev.filter((d) => d.id !== id));
      toast.success("Drive deleted");
    } catch {
      toast.error("Failed to delete drive.");
    }
  };

  // ── toggle open / closed ──────────────────────────────────────────────────
  const toggleStatus = async (id) => {
    try {
      const res = await API.patch(`/company/job_drives/${id}/status`);
      setDrives((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: res.data.status } : d))
      );
      toast.success("Status updated");
    } catch {
      toast.error("Failed to toggle status.");
    }
  };

  // ── update applicant status ───────────────────────────────────────────────
  const updateAppStatus = async (applicationId, status) => {
    try {
      await API.patch(`/company/applications/${applicationId}/status`, { status });
      setApplicants((prev) =>
        prev.map((a) => (a.application_id === applicationId ? { ...a, status } : a))
      );
      toast.success("Applicant status updated");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const scheduleInterview = async (applicationId, date) => {
    if (!date) return;
    try {
      await API.patch(`/company/applications/${applicationId}/schedule`, { interview_date: date });
      setApplicants((prev) =>
        prev.map((a) => (a.application_id === applicationId ? { ...a, status: "Interview", interview_date: date } : a))
      );
      toast.success("Interview scheduled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule interview");
    }
  };

  const batchUpdateStatus = async (status) => {
    if (selectedIds.length === 0) return toast.error("No applicants selected");
    try {
      await API.patch(`/company/applications/batch-status`, { ids: selectedIds, status });
      setApplicants((prev) =>
        prev.map((a) => selectedIds.includes(a.application_id) ? { ...a, status } : a)
      );
      setSelectedIds([]);
      toast.success(`Updated ${selectedIds.length} applicants to ${status}`);
    } catch {
      toast.error("Batch update failed");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplicants.length) setSelectedIds([]);
    else setSelectedIds(filteredApplicants.map(a => a.application_id));
  };

  // ── filtered applicants ───────────────────────────────────────────────────
  const filteredApplicants = cgpaFilter
    ? applicants.filter((a) => parseFloat(a.student_cgpa) >= parseFloat(cgpaFilter))
    : applicants;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in relative z-10">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-14 h-14 bg-brand-500/20 rounded-xl flex items-center justify-center border border-brand-500/30">
          <span className="text-3xl">🏢</span>
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-1">Company Dashboard</h1>
          <p className="text-slate-400">Post new job drives and review top engineering talent.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-panel overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-700/50 bg-slate-900/50 px-2 pt-2 gap-2">
          {["drives", "applicants"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium capitalize rounded-t-lg transition-all ${
                tab === t
                  ? "bg-slate-800 text-brand-400 border-t border-x border-slate-700/50 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {t === "drives" ? "📋 Drive Manager" : "👥 Applicants Filter"}
              {t === "drives" && (
                <span className="ml-2.5 bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-md text-xs">
                  {drives.length}
                </span>
              )}
              {t === "applicants" && (
                <span className="ml-2.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md text-xs">
                  {applicants.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ── DRIVES TAB ──────────────────────────────────────────────────── */}
          {tab === "drives" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-xl font-heading font-bold text-white">Active Job Drives</h2>
                <button
                  onClick={openCreateForm}
                  className="btn-primary flex items-center gap-2"
                >
                  <span className="text-lg leading-none">+</span> Create New Drive
                </button>
              </div>

              {/* Create / Edit Form */}
              {formOpen && (
                <div className="glass-card p-6 border-brand-500/30 animate-slide-up">
                  <h3 className="font-heading font-bold text-white mb-6 text-lg">
                    {editingId ? "✏️ Update Configuration" : "🚀 Launch New Drive"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Job Title / Role *</label>
                      <input
                        type="text"
                        value={form.job_title}
                        onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                        placeholder="e.g. Senior Backend Engineer"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Minimum CGPA Filter *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={form.min_cgpa}
                        onChange={(e) => setForm({ ...form, min_cgpa: e.target.value })}
                        placeholder="e.g. 7.5"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Interview Date (Optional)</label>
                      <input
                        type="date"
                        value={form.drive_date}
                        onChange={(e) => setForm({ ...form, drive_date: e.target.value })}
                        className="input-field [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Role Description / Technologies</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Detail the stack, responsibilities..."
                        rows={2}
                        className="input-field resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700/50">
                    <button
                      onClick={saveJob}
                      disabled={saving}
                      className="btn-primary px-8"
                    >
                      {saving ? "Deploying..." : editingId ? "Update Drive" : "Deploy Drive"}
                    </button>
                    <button
                      onClick={() => setFormOpen(false)}
                      className="btn-outline px-6"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Drives Table */}
              {drivesLoading ? (
                <div className="text-center py-16">
                  <span className="text-slate-400 animate-pulse">Fetching records...</span>
                </div>
              ) : drives.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-dashed border-slate-700">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-lg font-medium text-slate-200 mb-1">No job drives deployed</p>
                  <p className="text-sm text-slate-500">Initialize your first hiring event.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-700/50">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 font-medium">Job Title</th>
                        <th className="px-6 py-4 font-medium">Req. CGPA</th>
                        <th className="px-6 py-4 font-medium">Target Date</th>
                        <th className="px-6 py-4 font-medium">Traction</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30 bg-slate-900/30">
                      {drives.map((drive) => (
                        <tr key={drive.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-200">{drive.job_title}</td>
                          <td className="px-6 py-4 text-brand-400">{Number(drive.min_cgpa).toFixed(1)}</td>
                          <td className="px-6 py-4 text-slate-400">
                            {drive.drive_date ? new Date(drive.drive_date).toLocaleDateString() : "TBD"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-md text-xs font-semibold">
                              {drive.applicant_count} Leads
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              label={drive.status === "open" ? "● Receiving" : "○ Offline"}
                              colorClass={drive.status === "open" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}
                            />
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => toggleStatus(drive.id)}
                              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                                drive.status === "open"
                                  ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                                  : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                              }`}
                            >
                              {drive.status === "open" ? "Suspend" : "Activate"}
                            </button>
                            <button
                              onClick={() => openEditForm(drive)}
                              className="px-3 py-1.5 rounded-md text-xs font-medium border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteJob(drive.id)}
                              className="px-3 py-1.5 rounded-md text-xs font-medium border border-slate-600/50 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-colors"
                            >
                              Destroy
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── APPLICANTS TAB ──────────────────────────────────────────────── */}
          {tab === "applicants" && (
            <div className="space-y-6 animate-fade-in">
              {/* Intelligent Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/40 p-4 border border-slate-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center border border-brand-500/30 text-brand-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                  </div>
                  <span className="text-slate-300 font-medium text-sm">Strict Filter: Min CGPA</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={cgpaFilter}
                      onChange={(e) => setCgpaFilter(e.target.value)}
                      placeholder="e.g. 8.5"
                      className="w-24 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  {cgpaFilter && (
                    <button
                      onClick={() => setCgpaFilter("")}
                      className="text-slate-500 hover:text-white text-sm transition-colors"
                    >
                      Clear Rules
                    </button>
                  )}
                </div>

                {/* Batch Actions */}
                {selectedIds.length > 0 && (
                  <div className="flex items-center gap-3 animate-fade-in">
                    <span className="text-xs text-brand-400 font-bold uppercase tracking-wider">
                      {selectedIds.length} Selected
                    </span>
                    <select
                      onChange={(e) => batchUpdateStatus(e.target.value)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md border bg-brand-500/10 border-brand-500/30 text-brand-400 outline-none"
                      defaultValue=""
                    >
                      <option value="" disabled className="bg-slate-900">Batch Action...</option>
                      {["Shortlisted", "Interview", "Selected", "Rejected"].map(s => (
                        <option key={s} value={s} className="bg-slate-900 text-slate-200">{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="text-sm px-3 py-1 bg-slate-800 rounded-md text-slate-400 border border-slate-700">
                  <span className="text-brand-400 font-bold">{filteredApplicants.length}</span> matching records
                </div>
              </div>

              {appsLoading ? (
                 <div className="text-center py-16">
                 <span className="text-slate-400 animate-pulse">Analyzing profiles...</span>
               </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-dashed border-slate-700">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-lg font-medium text-slate-200 mb-1">Zero hits on criteria</p>
                  <p className="text-sm text-slate-500">Lower the CGPA requirements or wait for new leads.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-700/50">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700/50">
                      <tr>
                        <th className="px-4 py-4 w-10">
                          <input 
                            type="checkbox" 
                            className="accent-brand-500" 
                            checked={selectedIds.length === filteredApplicants.length && filteredApplicants.length > 0}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th className="px-6 py-4 font-medium">Candidate Profile</th>
                        <th className="px-6 py-4 font-medium">Candidate Score</th>
                        <th className="px-6 py-4 font-medium">Target Pipeline</th>
                        <th className="px-6 py-4 font-medium">Interview Info</th>
                        <th className="px-6 py-4 font-medium text-right">Selection State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30 bg-slate-900/30">
                      {filteredApplicants.map((a) => (
                        <tr key={a.application_id} className={`hover:bg-slate-800/50 transition-colors ${selectedIds.includes(a.application_id) ? "bg-brand-500/5" : ""}`}>
                          <td className="px-4 py-4">
                            <input 
                              type="checkbox" 
                              className="accent-brand-500"
                              checked={selectedIds.includes(a.application_id)}
                              onChange={() => toggleSelect(a.application_id)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-200">{a.student_name}</span>
                              <span className="text-xs text-slate-500">{a.student_email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5 min-w-[120px]">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-slate-500 uppercase">CGPA:</span>
                                <span className="font-bold text-brand-400 tracking-wide">{Number(a.student_cgpa).toFixed(2)}</span>
                              </div>
                              {a.match_score !== undefined && (
                                <div className="w-full flex flex-col gap-1 mt-0.5 p-1.5 rounded-md bg-slate-900/50 border border-slate-700/50">
                                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="text-indigo-400">Match Pulse</span>
                                    <span className={`text-[10px] ${a.match_score >= 70 ? "text-emerald-400" : a.match_score >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                                      {a.match_score}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden border border-slate-800">
                                     <div className={`h-full rounded-full transition-all duration-1000 ${a.match_score >= 70 ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : a.match_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${a.match_score}%` }}></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{a.job_title}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              {a.interview_date ? (
                                <div className="text-xs flex items-center gap-1.5 text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20 w-max">
                                  <span>📅</span>
                                  {new Date(a.interview_date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                </div>
                              ) : (
                                <input
                                  type="datetime-local"
                                  className="text-[10px] bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-400 focus:border-purple-500 outline-none [color-scheme:dark]"
                                  onChange={(e) => scheduleInterview(a.application_id, e.target.value)}
                                />
                              )}
                              <span className="text-[10px] text-slate-500">
                                Applied {new Date(a.applied_at).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <select
                              value={a.status}
                              onChange={(e) => updateAppStatus(a.application_id, e.target.value)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-md border text-center cursor-pointer outline-none focus:ring-2 focus:ring-brand-500/50 ${
                                STATUS_COLORS[a.status] || "bg-slate-800 text-slate-300 border-slate-700"
                              }`}
                            >
                              {["Applied", "Shortlisted", "Interview", "Selected", "Rejected"].map(
                                (s) => (
                                  <option key={s} value={s} className="bg-slate-900 text-slate-200">
                                    {s}
                                  </option>
                                )
                              )}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
